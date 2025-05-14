class NekoStdLib {
  constructor(runtime) {
    this.runtime = runtime;
    this.functions = {};
  }

  registerAll() {
    // Console output
    this.register('Afficher', this.nekAfficher.bind(this));
    
    // Math functions
    this.register('Additionner', this.nekAdditionner.bind(this));
    this.register('Soustraire', this.nekSoustraire.bind(this));
    this.register('Multiplier', this.nekMultiplier.bind(this));
    this.register('Diviser', this.nekDiviser.bind(this));
    this.register('Arrondir', this.nekArrondir.bind(this));
    
    // String functions
    this.register('Concatener', this.nekConcatener.bind(this));
    this.register('Longueur', this.nekLongueur.bind(this));
    
    // Array functions
    this.register('Tableau', this.nekTableau.bind(this));
    this.register('AjouterElement', this.nekAjouterElement.bind(this));
    this.register('ObtenirElement', this.nekObtenirElement.bind(this));
    
    // DOM functions (for web development)
    this.register('ElementHTML', this.nekElementHTML.bind(this));
    this.register('ModifierElement', this.nekModifierElement.bind(this));
    
    // Game development functions
    this.register('CreerSprite', this.nekCreerSprite.bind(this));
    this.register('Bouger', this.nekBouger.bind(this));
    this.register('DetecterCollision', this.nekDetecterCollision.bind(this));
  }

  register(name, fn) {
    this.functions[name] = fn;
  }

  hasFunction(name) {
    return name in this.functions;
  }

  callFunction(name, args) {
    if (!this.hasFunction(name)) {
      throw new Error(`Fonction standard non définie: nek${name}`);
    }
    
    return this.functions[name](...args);
  }

  // Console output
  nekAfficher(text) {
    console.log(text);
    return text;
  }

  // Math functions
  nekAdditionner(a, b) {
    return a + b;
  }

  nekSoustraire(a, b) {
    return a - b;
  }

  nekMultiplier(a, b) {
    return a * b;
  }

  nekDiviser(a, b) {
    if (b === 0) {
      throw new Error("Division par zéro n'est pas autorisée");
    }
    return a / b;
  }

  nekArrondir(number) {
    return Math.round(number);
  }

  // String functions
  nekConcatener(str1, str2) {
    return str1 + str2;
  }

  nekLongueur(str) {
    return str.length;
  }

  // Array functions
  nekTableau(...items) {
    return items;
  }

  nekAjouterElement(array, item) {
    array.push(item);
    return array;
  }

  nekObtenirElement(array, index) {
    if (index < 0 || index >= array.length) {
      throw new Error("Index hors limites");
    }
    return array[index];
  }

  // DOM functions (for web development)
  nekElementHTML(tagName, content, attributes = {}) {
    // In a web environment, this would create a DOM element
    // Here we'll just return a representation of it
    return {
      type: 'element',
      tagName,
      content,
      attributes
    };
  }

  nekModifierElement(element, property, value) {
    if (element && element.type === 'element') {
      element[property] = value;
    }
    return element;
  }

  // Game development functions
  nekCreerSprite(imageUrl, x, y, width, height) {
    return {
      type: 'sprite',
      imageUrl,
      x,
      y,
      width,
      height
    };
  }

  nekBouger(sprite, dx, dy) {
    if (sprite && sprite.type === 'sprite') {
      sprite.x += dx;
      sprite.y += dy;
    }
    return sprite;
  }

  nekDetecterCollision(sprite1, sprite2) {
    if (!sprite1 || !sprite2 || sprite1.type !== 'sprite' || sprite2.type !== 'sprite') {
      return false;
    }
    
    // Simple collision detection
    return !(
      sprite1.x + sprite1.width < sprite2.x ||
      sprite1.x > sprite2.x + sprite2.width ||
      sprite1.y + sprite1.height < sprite2.y ||
      sprite1.y > sprite2.y + sprite2.height
    );
  }
}

module.exports = {
  NekoStdLib
};
