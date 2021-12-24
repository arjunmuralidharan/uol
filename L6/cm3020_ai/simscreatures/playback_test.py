import os
import genome
import sys
import creature
import pybullet as p


def main(csv_file):
    assert os.path.exists(csv_file), "Tried to load " + \
                          csv_file + " but it does not exists"
    dna = genome.Genome.from_csv(csv_file)
    cr = creature.Creature(gene_count=1)
    cr.update_dna(dna)
    p.connect(p.GUI)
    p.setPhysicsEngineParameter(enableFileCaching=0)
    p.configureDebugVisualizer(p.COV_ENABLE_GUI, 0)
    plane_shape = p.createCollisionShape(p.GEOM_PLANE)
    floor = p.createMultiBody(plane_shape, plane_shape)
    p.setGravity(0, 0, -10)

if __name__ == "__main__":
    assert len(sys.argv) == 2, "Usage: python playback_test.py csv_filename"
    main(sys.argv[1])