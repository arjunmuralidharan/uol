import numpy as np

class Genome():
    @staticmethod
    def get_random_gene(length):
        gene = [np.random.random() for i in range(length)]
        return gene