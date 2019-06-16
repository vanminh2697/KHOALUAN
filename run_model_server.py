import argparse
import os
import numpy as np
np.random.seed(0)
import tensorflow as tf
tf.set_random_seed(0)
from sklearn.model_selection import KFold

import pickle
import copy

from  utils import collect_data_infor_from_tsv, load_word_embeddings

from config import ModelConfig
from features import WordPreprocessor

from collections import OrderedDict, defaultdict
from redis import StrictRedis
import time 

#connect to redis server
r = StrictRedis(host='localhost', port=6379, db=0)



from matepc import MATEPC

def create_data_object(X_test, Y_test):
    results = {}
    results['X_test'] = X_test
    results['Y_test'] = Y_test
    # print("Data  test: ", X_test[0].shape, Y_test.shape)
    return results


def write_result(fo_path, sents, ys_true, ys_pred):
    with open(fo_path, mode="w") as f:
        for sent, y_true, y_pred in zip(sents, ys_true, ys_pred):
            assert len(sent) == len(y_true) == len(y_pred)
            for word, y_t, y_p in zip(sent, y_true, y_pred):
                f.write("{0}\t{1}\t{2}\n".format(word, y_t, y_p))
            f.write("\n")


def get_entities(seq):
    """Gets entities from sequence.

    Args:
        seq (list): sequence of labels.

    Returns:
        list: list of (chunk_type, chunk_start, chunk_end).

    Example:
        >>> seq = ['B-PER', 'I-PER', 'O', 'B-LOC']
        >>> print(get_entities(seq))
        [('PER', 0, 2), ('LOC', 3, 4)]
    """
    i = 0
    chunks = []
    seq = seq + ['O']  # add sentinel
    types = [tag.split('-')[-1] for tag in seq]
    while i < len(seq):
        if seq[i].startswith('B'):
            for j in range(i+1, len(seq)):
                if seq[j].startswith('I') and types[j] == types[i]:
                    continue
                break
            chunks.append((types[i], i, j))
            i = j
        else:
            i += 1
    return chunks

def predict_step(sess, model, p, data, data_type, crf_transition_parameters):
    X = data["X_{0}".format(data_type)]
    Y = data["Y_{0}".format(data_type)]
    ys_pred = []
    ys_true = []
    losses = []
    for i in range(Y.shape[0]):
        feed_dict = {
            model.input_word_indices:  X[0][i:i+1,:],
            model.input_mask: X[1][i:i+1],
            model.input_sequence_length: X[2][i:i+1],
            model.output_label_indices: Y[i:i+1],
            model.dropout_keep_prob: 1.0
        }
        unary_scores, loss = sess.run([model.unary_scores, model.loss], feed_dict)
        losses.append(loss)
        unary_scores_i = unary_scores[0][:X[2][i],:]
        #print(unary_scores)
        y_pred, _ = tf.contrib.crf.viterbi_decode(unary_scores_i, crf_transition_parameters)
        y_true = list(Y[i][:X[2][i]])

        y_true_inversed =  p.inverse_transform(y_true)
        y_pred_inversed = p.inverse_transform(y_pred)
        ys_pred.append(y_pred_inversed)
        ys_true.append(y_true_inversed)
        assert len(y_pred) == len(y_true)
    # print(ys_pred)
    f1 = f1_score(ys_pred, ys_true)
    losses = np.array(losses)
    losses_avg = np.mean(losses)
    return f1, ys_pred, ys_true, losses_avg

def f1_score(y_true, y_pred):
    """Evaluates f1 score.

    Args:
        y_true (list): true labels.
        y_pred (list): predicted labels.
        sequence_lengths (list): sequence lengths.

    Returns:
        float: f1 score.

    Example:
        >>> y_true = []
        >>> y_pred = []
        >>> sequence_lengths = []
        >>> print(f1_score(y_true, y_pred, sequence_lengths))
        0.8
    """
    correct_preds, total_correct, total_preds = 0., 0., 0.
    for lab, lab_pred in zip(y_true, y_pred):
        lab_chunks = set(get_entities(lab))
        lab_pred_chunks = set(get_entities(lab_pred))

        correct_preds += len(lab_chunks & lab_pred_chunks)
        total_preds += len(lab_pred_chunks)
        total_correct += len(lab_chunks)

    p = correct_preds / total_preds if correct_preds > 0 else 0
    r = correct_preds / total_correct if correct_preds > 0 else 0
    f1 = 2 * p * r / (p + r) if correct_preds > 0 else 0
    return f1

def load_model(data_name="laptops", task_name="ATEPC", params_str = "w2v,150,200,20,0.0010,30,0.000"):
    DATA_ROOT = os.getcwd() + '/data'
    SAVE_ROOT = os.getcwd() + '/models'  # trained models
    LOG_ROOT = os.getcwd() + '/result_minh'

    print("-----{0}-----{1}-----{2}-----".format(task_name, data_name, params_str))

    # ----- create save directory -----
    save_path = SAVE_ROOT + "/{0}/{1}".format(data_name, task_name)
    if not os.path.exists(SAVE_ROOT):
        os.makedirs(SAVE_ROOT)
    if not os.path.exists(LOG_ROOT):
        os.makedirs(LOG_ROOT)
    if not os.path.exists(SAVE_ROOT + "/{0}".format(data_name)):
        os.makedirs(SAVE_ROOT + "/{0}".format(data_name))
    if not os.path.exists(save_path):
        os.makedirs(save_path)

    test_path = os.path.join(DATA_ROOT, '{0}.{1}.test.tsv'.format(data_name, task_name))
    train_path = os.path.join(DATA_ROOT, '{0}.{1}.train.tsv'.format(data_name, task_name))
    
    # train set
    sents1, _, _, _, labels1, preds1 = collect_data_infor_from_tsv(train_path, keep_conflict=False)
    


      ### Test ####



    # ----- Model Config
    model_config = ModelConfig()
    model_config.adjust_params_follow_paramstr(params_str)
    p = WordPreprocessor()
    p.fit()
    model_config.adjust_params_follow_preprocessor(p)



    w_embedding_path = 'models/{0}.word.{1}.txt'.format(model_config.embedding_name, model_config.word_embedding_size)
    W_embedding = load_word_embeddings(p.vocab_word, w_embedding_path, model_config.word_embedding_size)

    # for evaluation 2 tasks

    i_fold = 3
    model_name = params_str


    sess = tf.Session()

    index = 17
    x = 0
    with sess.as_default():
        model_name_ifold = model_name + "." + str(i_fold)
        model = MATEPC(config=model_config)
        sess.run(tf.global_variables_initializer())
        model.load_word_embedding(sess, initial_weights=W_embedding)
        model.saver.restore(sess, save_path=os.path.join(save_path,model_name_ifold))
        while True :
            x +=1
            seqs = r.keys('*')
            if len(seqs)>0:
                k = r.get(seqs[0])
                if (len(k.split()) < 1):
                    X =[]
                    Y = []
                    for i in seqs:
                        iSplit = list(i.split())
                        X.append([element.lower() for element in iSplit])
                        temp = " ".join('O' for i in range(len(i.split())))
                        Y.append(list(temp.split()))
                        sents2= X
                        X_test,Y_test = p.transform(X1=X,Y=Y)
                    data = create_data_object(X_test, Y_test)
                    crf_transition_parameters = sess.run(model.crf_transition_parameters)
                    f1_test, ys_pred, ys_true, loss_test = predict_step(sess, model, p, data, "test", crf_transition_parameters)
                    for i in range(len(seqs)): 
                        r.set(seqs[i],' '.join(ys_pred[i]))
                    write_result(os.path.join(LOG_ROOT,str(index)+".txt"), sents2, ys_true, ys_pred)
                    index = index +1
            print(x)
            time.sleep(1)

        
if __name__ == "__main__":
	load_model()
