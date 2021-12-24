import unittest
import simulation
import creature
import population

class TestSim(unittest.TestCase):
    def testSimExists(self):
        sim = simulation.Simulation()
        self.assertIsNotNone(sim)

    def testSimId(self):
        sim = simulation.Simulation()
        self.assertIsNotNone(sim.physicsClientId)

    def testRun(self):
        sim = simulation.Simulation()
        self.assertIsNotNone(sim.run_creature)

    def testPos(self):
        sim = simulation.Simulation()
        cr = creature.Creature(gene_count = 3)
        sim.run_creature(cr)
        self.assertNotEqual(cr.start_position, cr.last_position)
    
    def testPop(self):
        pop = population.Population(pop_size=5, gene_count=3)
        sim = simulation.Simulation()
        for cr in pop.creatures:
            sim.run_creature(cr)
        dists = [cr.get_distance_travelled() for cr in pop.creatures]
        print(dists)
        self.assertIsNotNone(dists)

    def testProc(self):
        pop = population.Population(pop_size=20, gene_count=3)
        print(len(pop.creatures))
        tsim = simulation.ThreadedSim(pool_size=4)
        print(len(tsim.sims))
        # tsim.eval_population(pop, 2400)
        # dists = [cr.get_distance_travelled() for cr in pop.creatures]
        # print(dists)
        # self.assertIsNotNone(dists)


unittest.main()