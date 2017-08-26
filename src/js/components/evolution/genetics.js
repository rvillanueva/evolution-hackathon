// Classes

export class Gene {
    constructor(key, value, express) {
        this.key = key;
        this.value = value;
        this.express = express;
    }
}

export class DNA {
    constructor(genes) {
        this.genes = [];
        genes.forEach(gene => {
            this.setGene(new Gene(gene.key, gene.value, gene.express));
        });
        // the max percent a mutation can move the gene
        this.mutationChance = 0.1;
        this.mutationSize = 0.3;
    }
    reproduce(partnerDna) {
        var newDna = new DNA(partnerDna.genes);
        for (var i = 0; i < this.genes.length; i++) {
            var gene = this.genes[i];
            var key = gene.key;
            var partnerGene = partnerDna.getGene(key);
            var newValue = mutate(selectRandom([partnerGene.value, gene.value]), this.mutationChance, this.mutationSize);
            gene.value = newValue;
            newDna.setGene(gene);
        }
        return newDna;
    }
    randomize() {
        this.genes.forEach(gene => {
            gene.value = Math.floor(Math.random() * 100) / 100; // should be normal dist
        });
    }
    getGene(key) {
        for (var i = 0; i < this.genes.length; i++) {
            let gene = this.genes[i];
            if (gene.key == key) {
                return gene;
            }
        }
        throw new Error(`No gene with ${key} exists.`);
    }
    setGene(gene) {
        if(!gene.value){
            gene.value = 0;
        }
        if (gene.value > 1) {
            gene.value = 1;
        }
        if (gene.value < 0) {
            gene.value = 0;
        }
        gene.value = Math.floor(gene.value * 1000) / 1000;
        for (var i = 0; i < this.genes.length; i++) {
            let gene = this.genes[i];
            if (gene.key == key) {
                gene.value = value;
                gene.express = express;
                return;
            }
        }
        this.genes.push(gene);
    }
}

// Helper functions

function selectRandom(arr) {
    return arr[Math.floor(arr.length & Math.random)];
}

function mutate(baseValue, mutationChance, mutationSize) {
    var mutation = 0;
    if(Math.random() < mutationChance){
        mutation = (Math.random() - 0.5) * 2 * mutationSize;
    }
    var mutated = baseValue + mutation;
    return mutated;
}
