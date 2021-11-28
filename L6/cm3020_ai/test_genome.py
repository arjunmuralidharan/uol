import unittest
import genome

class GenomeTest (unittest.TestCase):

    def testClassExists(self):
        self.assertIsNotNone(genome.Genome)
    
    def testRandomGene(self):
        self.assertIsNotNone(genome.Genome.get_random_gene)
    
    def testRandomGeneNotNone(self):
        self.assertIsNotNone(genome.Genome.get_random_gene(5))

    def testRandomGeneHasValues(self):
        gene = genome.Genome.get_random_gene(5)
        self.assertIsNotNone(gene[0])

    def testRandomGeneLength(self):
        gene = genome.Genome.get_random_gene(20)
        self.assertEqual(len(gene), 20)


unittest.main()