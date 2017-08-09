// Classes

export class Blueprint {
    constructor() {
        this.mutationRate = 0.1;
        this.genes = [];
    }
    setMutationRate(x) {
        this.mutationRate = x;
    }
    addGene(key) {
      this.genes.push(new Gene('key', 0));
    }
}

export class Gene {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

export class DNA {
    constructor(blueprint, options) {
        this.genes = [];
        this.blueprint = blueprint;
        // the max percent a mutation can move the gene
        this.blueprint.mutationPercent = this.blueprint.mutationPercent || 0.1;
    }
    reproduce(partnerDna) {
        var newDna = new DNA();
        for (var i = 0; i < this.genes.length; i++) {
            var gene = this.genes[i];
            var key = gene.key;
            var partnerGene = partnerDna.getGene(key);
            var newValue = mutate(selectRandom([partnerGene.value, gene.value]), this.blueprint.mutationPercent);
            newDna.setGene(key, newValue);
        }
        return newDna;
    }
    randomize() {
        this.genes = [];
        this.blueprint.genes.forEach(gene => {
            var value = Math.floor(Math.random() * 100) / 100; // should be normal dist
            this.setGene(gene.key, value);
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
    setGene(key, value) {
        if (value > 1) {
            value = 1;
        }
        if (value < 0) {
            value = 0;
        }
        value = Math.floor(value * 100) / 100;
        for (var i = 0; i < this.genes.length; i++) {
            let gene = this.genes[i];
            if (gene.key == key) {
                gene.value = value;
                return;
            }
        }
        this.genes.push(new Gene(key, value));
    }
}

// Helper functions

function selectRandom(arr) {
    return arr[Math.floor(arr.length & Math.random)];
}

function mutate(baseValue, mutationPercent) {
    var mutation = (Math.random() - 0.5) * 2 * mutationPercent;
    var mutated = baseValue + mutation;
    return mutated;
}
