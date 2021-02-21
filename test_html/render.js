/*! 
 * RenderJS - Create html page in pure js
 * https://pimenov.com.ua
 *
 * Copyright 2021 Serhii Pimenov
 * Released under the MIT license
 */

(function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function setStyles() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.keys(src).map(key => "".concat(dashedName(key), ": ").concat(src[key])).join(";");
  }
  function setClasses() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return Array.isArray(src) ? src.join(" ") : src.toString();
  }
  function dashedName(str) {
    return str.replace(/([A-Z])/g, function (u) {
      return "-" + u.toLowerCase();
    });
  }
  function addRequiredRole() {
    var role = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ = _objectSpread2({}, options);

    if (!_.data) {
      _.data = {};
    }

    _.data.role = role;
    return _;
  }
  function addRequiredClasses() {
    var required = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var source = arguments.length > 1 ? arguments[1] : undefined;

    if (!source) {
      return required;
    }

    return new Set([...source, ...required]);
  }

  var universalAttributes = ["accesskey", "contenteditable", "contextmenu", "dir", "id", "lang", "spellcheck", "tabindex", "title"];

  class BaseElement {
    constructor() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.options = options;
      this.tag = "div";
    }

    extendAttributes(attr) {
      var newAttr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var _attr = attr;

      for (var key in this.options) {
        if (!_attr.includes(key) && newAttr.includes(key)) _attr.push("".concat(key, "=\"").concat(this.options[key], "\""));
      }

      return _attr;
    }

    selfAttributes() {
      return [];
    }

    attributes() {
      var attr = [];
      if (this.classes) attr.push("class=\"".concat(this.classes, "\""));
      if (this.styles) attr.push("style=\"".concat(this.styles, "\""));
      if (this.dataSet) attr.push(this.dataSet);

      for (var key in this.options) {
        if (["className", "style", "data", "hidden", "tag", "events"].includes(key)) continue;
        if (!universalAttributes.includes(key)) continue;
        attr.push("".concat(key, "=\"").concat(this.options[key], "\""));
      }

      for (var _key in this.options) {
        if (!attr.includes(_key) && this.selfAttributes().includes(_key)) attr.push("".concat(_key, "=\"").concat(this.options[_key], "\""));
      }

      if (this.options.hidden) attr.push('hidden');
      if (this.options.disabled) attr.push('disabled');
      if (this.options.required) attr.push("required");
      if (this.options.readonly) attr.push("readonly");
      if (this.options.selected) attr.push("selected");
      if (this.options.open) attr.push("open");
      if (this.options.multiple) attr.push("multiple");
      if (this.options.default) attr.push("default");
      return attr;
    }

    draw() {
      return this.template();
    }

    get dataSet() {
      var {
        data = {}
      } = this.options;
      var _ = [];
      if (data === {}) return "";

      for (var key in data) {
        _.push("data-".concat(dashedName(key), "=\"").concat(data[key], "\""));
      }

      return _.join(" ");
    }

    get events() {
      var {
        events = {}
      } = this.options;
      var eventsArray = [];
      if (events === {}) return "";

      for (var key in events) {
        eventsArray.push("".concat(key.toLowerCase(), "=\"").concat(events[key], "\""));
      }

      return eventsArray.join(" ");
    }

    get classes() {
      var {
        className = []
      } = this.options;
      return setClasses(className);
    }

    get styles() {
      var {
        style = {}
      } = this.options;
      return setStyles(style);
    }

    template() {
      return "";
    }

  }

  var parser = element => {
    if (Array.isArray(element)) {
      return element.map(parser).join("");
    } else if (typeof element === 'string') {
      return element;
    } else if (element.draw) {
      return element.draw();
    }

    throw new Error("Unknown element! " + element);
  };

  class Tag extends BaseElement {
    constructor() {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof children === 'object' && !Array.isArray(children) && !(children instanceof BaseElement)) {
        options = children;
        children = '';
      }

      super(options);
      this.children = children;
    }

    template(content) {
      var tag = this.options.tag ? this.options.tag : this.tag;
      return "\n            <".concat(tag, " ").concat(this.attributes().join(" "), " ").concat(this.events, ">").concat(content, "</").concat(tag, ">\n        ");
    }

    draw() {
      var children = this.children,
          html;

      if (children == null) {
        children = '';
      }

      if (typeof children === "string") {
        html = children;
      } else if (children instanceof BaseElement) {
        html = children.draw();
      } else if (Array.isArray(children)) {
        html = children.map(parser).join("");
      } else {
        html = '';
      }

      return this.template(html);
    }

  }

  class TagEmpty extends BaseElement {
    constructor() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      super(options);
      this.options = options;
    }

    template() {
      var tag = this.options.tag ? this.options.tag : this.tag;
      return "\n            <".concat(tag, " ").concat(this.attributes().join(" "), " ").concat(this.events, "/>\n        ");
    }

  }

  var render = function render() {
    var model = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var mountTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
    var html;
    html = model.map(parser).join("");
    mountTo.insertAdjacentHTML('beforeend', html);
  };

  class Span extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'span');
    }

  }
  var span = function span() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Span(children, options);
  };

  class Img extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'img');
    }

    selfAttributes() {
      return ["align", "alt", "border", "height", "hspace", "ismap", "longdesc", "lowsrc", "src", "vspace", "width", "usemap"];
    }

  }
  var img = function img() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Img(options);
  };
  var img2 = function img2() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var alt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return img(_objectSpread2(_objectSpread2({}, options), {}, {
      src,
      alt
    }));
  };

  class Input extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", "input");
    }

    selfAttributes() {
      return ["accept", "align", "alt", "autocomplete", "autofocus", "border", "checked", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "list", "max", "maxlength", "min", "multiple", "name", "pattern", "placeholder", "size", "src", "step", "type", "value"];
    }

  }
  var input = function input() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Input(options);
  };
  var input2 = function input2() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Input(_objectSpread2(_objectSpread2({}, options), {}, {
      value
    }));
  };

  class Br extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'br');
    }

    selfAttributes() {
      return ["clear"];
    }

  }
  var br = options => new Br(options);

  class Hr extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'hr');
    }

  }
  var hr = options => new Hr(options);

  class Title extends Tag {
    constructor() {
      var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'h1';
      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      super(children, options);
      this.tag = tag;
    }

  }
  var title = function title() {
    var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'h1';
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new Title(tag, children, options);
  };
  var h1 = function h1() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Title('h1', children, options);
  };
  var h2 = function h2() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Title('h2', children, options);
  };
  var h3 = function h3() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Title('h3', children, options);
  };
  var h4 = function h4() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Title('h4', children, options);
  };
  var h5 = function h5() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Title('h5', children, options);
  };
  var h6 = function h6() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Title('h6', children, options);
  };

  class Section extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'section');
    }

  }
  var section = function section() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Section(children, options);
  };

  class Anchor extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'a');
    }

    selfAttributes() {
      return ["coords", "download", "hreflang", "name", "rel", "rev", "shape", "target", "type", "href"];
    }

  }
  var anchor = function anchor() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Anchor(children, options);
  };
  var a = function a() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Anchor(children, options);
  };
  var anchor2 = function anchor2() {
    var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#';
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new Anchor(children, _objectSpread2(_objectSpread2({}, options), {}, {
      href
    }));
  };

  class Abbr extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", "abbr");
    }

  }
  var abbr = function abbr() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Abbr(children, options);
  };

  class Article extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'article');
    }

  }
  var article = function article() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Article(children, options);
  };

  class Nav extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'nav');
    }

  }
  var nav = function nav() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Nav(children, options);
  };

  class Aside extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'aside');
    }

  }
  var aside = function aside() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Aside(children, options);
  };

  class Header extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'header');
    }

  }
  var header = function header() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Header(children, options);
  };

  class Footer extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'footer');
    }

  }
  var footer = function footer() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Footer(children, options);
  };

  class Address extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'address');
    }

  }
  var address = function address() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Address(children, options);
  };

  class Map extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'map');
    }

    selfAttributes() {
      return ["name"];
    }

  }
  var map = function map() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Map(children, options);
  };
  class Area extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'area');
    }

    selfAttributes() {
      return ["alt", "coords", "hreflang", "nohref", "shape", "target", "type", "href"];
    }

  }
  var area = function area() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Area(options);
  };
  var area2 = function area2() {
    var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return area(_objectSpread2(_objectSpread2({}, options), {}, {
      href
    }));
  };

  class AudioTag extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'audio');
    }

    selfAttributes() {
      return ["autoplay", "controls", "loop", "preload", "src"];
    }

  }
  var audio = function audio() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new AudioTag(children, options);
  };
  var audio2 = function audio2() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new AudioTag(children, _objectSpread2(_objectSpread2({}, options), {}, {
      src
    }));
  };

  class Bold extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'b');
    }

  }
  var bold = function bold() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Bold(children, options);
  };

  class Bdi extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'bdi');
    }

  }
  var bdi = function bdi() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Bdi(children, options);
  };

  class Bdo extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'bdo');
    }

  }
  var bdo = function bdo() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Bdo(children, options);
  };

  class Blockquote extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'blockquote');
    }

    selfAttributes() {
      return ["cite"];
    }

  }
  var blockquote = function blockquote() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Blockquote(children, options);
  };

  class Button extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'button');
    }

    selfAttributes() {
      return ["autofocus", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name", "type", "value"];
    }

  }
  var button = function button() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Button(children, options);
  };

  class Canvas extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'canvas');
    }

    selfAttributes() {
      return ["width", "height"];
    }

  }
  var canvas = function canvas() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Canvas(children, options);
  };

  class Table extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'table');
    }

    selfAttributes() {
      return ["align", "background", "bgcolor", "border", "bordercolor", "cellpadding", "cellspacing", "cols", "frame", "height", "rules", "summary", "width"];
    }

  }
  var table = function table() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Table(children, options);
  };
  class Caption extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'caption');
    }

    selfAttributes() {
      return ["align", "valign"];
    }

  }
  var caption = function caption() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Caption(children, options);
  };
  class Col extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'col');
    }

    selfAttributes() {
      return ["align", "valign", "char", "charoff", "span", "width"];
    }

  }
  var col = options => new Col(options);
  class Colgroup extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'colgroup');
    }

    selfAttributes() {
      return ["align", "valign", "char", "charoff", "span", "width"];
    }

  }
  var colgroup = options => new Colgroup(options);
  class TableSection extends Tag {
    constructor() {
      var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tbody';
      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      super(children, options);
      this.tag = tag;
    }

    selfAttributes() {
      return ["align", "valign", "char", "charoff", "bgcolor"];
    }

  }
  var tbody = function tbody() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new TableSection('tbody', children, options);
  };
  var thead = function thead() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new TableSection('thead', children, options);
  };
  var tfoot = function tfoot() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new TableSection('tfoot', children, options);
  };
  class TableRow extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", "tr");
    }

    selfAttributes() {
      return ["align", "bgcolor", "bordercolor", "char", "charoff", "valign"];
    }

  }
  var tr = function tr() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new TableRow(children, options);
  };
  class TableCell extends Tag {
    constructor() {
      var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'td';
      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      super(children, options);
      this.tag = tag;
    }

    selfAttributes() {
      return ["abbr", "align", "axis", "background", "bgcolor", "bordercolor", "char", "charoff", "colspan", "headers", "height", "nowrap", "rowspan", "scope", "valign", "width"];
    }

  }
  var th = function th() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new TableCell('th', children, options);
  };
  var td = function td() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new TableCell('td', children, options);
  };

  class Cite extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'cite');
    }

  }
  var cite = function cite() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Cite(children, options);
  };

  class Code extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'code');
    }

  }
  var code = function code() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Code(children, options);
  };

  class Dl extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'dl');
    }

  }
  class Dt extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'dt');
    }

  }
  class Dd extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'dd');
    }

  }
  var dl = function dl() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Dl(children, options);
  };
  var dt = function dt() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Dt(children, options);
  };
  var dd = function dd() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Dd(children, options);
  };

  class Details extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'details');
    }

  }
  var details = function details() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Details(children, options);
  };
  class Summary extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'summary');
    }

  }
  var summary = function summary() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Summary(children, options);
  };

  class Dfn extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'dfn');
    }

  }
  var dfn = function dfn() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Dfn(children, options);
  };

  class Div extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'div');
    }

    selfAttributes() {
      return ["align", "title"];
    }

  }
  var div = function div() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Div(children, options);
  };

  class Em extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'em');
    }

  }
  var em = function em() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Em(children, options);
  };

  class Ital extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'i');
    }

  }
  var ital = function ital() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Ital(children, options);
  };
  var i = function i() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Ital(children, options);
  };

  class Strong extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'strong');
    }

  }
  var strong = function strong() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Strong(children, options);
  };

  class Embed extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'embed');
    }

    selfAttributes() {
      return ["align", "height", "hspace", "pluginspace", "src", "type", "vspace", "width"];
    }

  }
  var embed = function embed() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Embed(children, options);
  };
  class NoEmbed extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'noembed');
    }

  }
  var noembed = function noembed() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new NoEmbed(children, options);
  };

  class Fieldset extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'fieldset');
    }

    selfAttributes() {
      return ["form", "title"];
    }

  }
  var fieldset = function fieldset() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Fieldset(children, options);
  };
  class Legend extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'legend');
    }

    selfAttributes() {
      return ["align", "title"];
    }

  }
  var legend = function legend() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Legend(children, options);
  };

  class Figure extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'figure');
    }

  }
  var figure = function figure() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Figure(children, options);
  };
  class FigCaption extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'figcaption');
    }

  }
  var figcaption = function figcaption() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new FigCaption(children, options);
  };

  class Form extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'form');
    }

    selfAttributes() {
      return ["accept-charset", "action", "autocomplete", "enctype", "method", "name", "novalidate", "target"];
    }

  }
  var form = function form() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Form(children, options);
  };

  class Frameset extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'frameset');
    }

    selfAttributes() {
      return ["border", "bordercolor", "cols", "frameborder", "framespacing", "rows"];
    }

  }
  var frameset = function frameset() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Frameset(children, options);
  };
  class Frame extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'frame');
    }

    selfAttributes() {
      return ["bordercolor", "frameborder", "noresize", "name", "src", "scrolling"];
    }

  }
  var frame = function frame() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Frame(options);
  };
  var frame2 = function frame2() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new Frame(_objectSpread2(_objectSpread2({}, options), {}, {
      src,
      name
    }));
  };
  class NoFrames extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'noframes');
    }

  }
  var noframes = function noframes() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new NoFrames(children, options);
  };

  class IFrame extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'iframe');
    }

    selfAttributes() {
      return ["align", "allowtransparency", "frameborder", "height", "hspace", "marginheight", "marginwidth", "name", "sandbox", "scrolling", "seamless", "src", "srcdoc", "vspace", "width"];
    }

  }
  var iframe = function iframe() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new IFrame(children, options);
  };
  var iframe2 = function iframe2() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return new IFrame(children, _objectSpread2(_objectSpread2({}, options), {}, {
      src,
      name
    }));
  };

  class Ins extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'ins');
    }

    selfAttributes() {
      return ["cite", "datetime"];
    }

  }
  var ins = function ins() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Ins(children, options);
  };

  class Kbd extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'kbd');
    }

  }
  var kbd = function kbd() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Kbd(children, options);
  };

  class Label extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'label');
    }

    selfAttributes() {
      return ["for"];
    }

  }
  var label = function label() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Label(children, options);
  };
  var label2 = function label2() {
    var _for = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return label(children, _objectSpread2(_objectSpread2({}, options), {}, {
      "for": _for
    }));
  };

  class List extends Tag {
    constructor() {
      var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ul';
      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      super(children, options);
      this.tag = tag;
    }

    selfAttributes() {
      return this.tag === 'ul' ? ["type"] : ["type", "reserved", "start"];
    }

  }
  class ListItem extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", "li");
    }

    selfAttributes() {
      return ["type", "value"];
    }

  }
  var ul = function ul() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new List('ul', children, options);
  };
  var ol = function ol() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new List('ol', children, options);
  };
  var li = function li() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new ListItem(children, options);
  };

  class Mark extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'mark');
    }

  }
  var mark = function mark() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Mark(children, options);
  };

  class NoScript extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'noscript');
    }

  }
  var noscript = function noscript() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new NoScript(children, options);
  };

  class Select extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'select');
    }

    selfAttributes() {
      return ["autofocus", "form", "name", "size"];
    }

  }
  var select = function select() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Select(children, options);
  };
  class OptionGroup extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'optgroup');
    }

    selfAttributes() {
      return ["label"];
    }

  }
  var optgroup = function optgroup() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new OptionGroup(children, options);
  };
  class Option extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'option');
    }

    selfAttributes() {
      return ["label", "value"];
    }

  }
  var option = function option() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new Option(value, children, options);
  };

  class Output extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'output');
    }

    selfAttributes() {
      return ["for", "form", "name"];
    }

  }
  var output = function output() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Output(children, options);
  };

  class Paragraph extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'p');
    }

    selfAttributes() {
      return ["align"];
    }

  }
  var paragraph = function paragraph() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Paragraph(children, options);
  };
  var p = function p() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Paragraph(children, options);
  };

  class Pre extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'pre');
    }

  }
  var pre = function pre() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Pre(children, options);
  };

  class Quoted extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'q');
    }

    selfAttributes() {
      return ["cite"];
    }

  }
  var q = function q() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Quoted(children, options);
  };

  class Strike extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'strike');
    }

  }
  var strike = function strike() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Strike(children, options);
  };
  var s = function s() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Strike(children, options);
  };

  class Script extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'script');
    }

    selfAttributes() {
      return ["async", "defer", "language", "src", "type"];
    }

  }
  var script = function script() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Script(children, options);
  };
  var script2 = function script2() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return script(children, _objectSpread2(_objectSpread2({}, options), {}, {
      src
    }));
  };

  class Small extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'small');
    }

  }
  var small = function small() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Small(children, options);
  };

  class Source extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'source');
    }

    selfAttributes() {
      return ["media", "src", "type"];
    }

  }
  var source = function source() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Source(options);
  };
  var source2 = function source2() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return source(_objectSpread2(_objectSpread2({}, options), {}, {
      src
    }));
  };

  class Sub extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'sub');
    }

  }
  var sub = function sub() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Sub(children, options);
  };

  class Sup extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'sup');
    }

  }
  var sup = function sup() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Sup(children, options);
  };

  class Textarea extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'textarea');
    }

    selfAttributes() {
      return ["autofocus", "cols", "form", "maxlength", "name", "placeholder", "rows", "wrap"];
    }

  }
  var textarea = function textarea() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Textarea(children, options);
  };

  class Time extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'time');
    }

    selfAttributes() {
      return ["datetime", "pubdate"];
    }

  }
  var time = function time() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Time(children, options);
  };

  class Track extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'track');
    }

    selfAttributes() {
      return ["kind", "src", "srclang", "label"];
    }

  }
  var track = function track() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Track(options);
  };
  var track2 = function track2() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return track(_objectSpread2(_objectSpread2({}, options), {}, {
      src
    }));
  };

  class Var extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'var');
    }

  }
  var variable = function variable() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Var(children, options);
  };

  class VideoTag extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'video');
    }

    selfAttributes() {
      return ["autoplay", "controls", "height", "loop", "loop", "poster", "preload", "src", "width"];
    }

  }
  var video = function video() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new VideoTag(children, options);
  };
  var video2 = function video2() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return video(children, _objectSpread2(_objectSpread2({}, options), {}, {
      src
    }));
  };

  class Wbr extends TagEmpty {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'wbr');
    }

  }
  var wbr = options => new Wbr(options);

  class Main extends Tag {
    constructor() {
      super(...arguments);

      _defineProperty(this, "tag", 'main');
    }

  }
  var main = function main() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Main(children, options);
  };

  var html = /*#__PURE__*/Object.freeze({
    __proto__: null,
    br: br,
    Br: Br,
    hr: hr,
    Hr: Hr,
    span: span,
    Span: Span,
    Img: Img,
    img: img,
    img2: img2,
    Input: Input,
    input: input,
    input2: input2,
    title: title,
    Title: Title,
    h1: h1,
    h2: h2,
    h3: h3,
    h4: h4,
    h5: h5,
    h6: h6,
    section: section,
    Section: Section,
    anchor: anchor,
    a: a,
    anchor2: anchor2,
    Anchor: Anchor,
    abbr: abbr,
    Abbr: Abbr,
    article: article,
    Article: Article,
    nav: nav,
    Nav: Nav,
    aside: aside,
    Aside: Aside,
    header: header,
    Header: Header,
    footer: footer,
    Footer: Footer,
    address: address,
    Address: Address,
    map: map,
    Map: Map,
    area: area,
    Area: Area,
    area2: area2,
    audio: audio,
    audio2: audio2,
    AudioTag: AudioTag,
    bold: bold,
    Bold: Bold,
    bdi: bdi,
    Bdi: Bdi,
    bdo: bdo,
    Bdo: Bdo,
    blockquote: blockquote,
    Blockquote: Blockquote,
    button: button,
    Button: Button,
    canvas: canvas,
    Canvas: Canvas,
    table: table,
    Table: Table,
    caption: caption,
    Caption: Caption,
    col: col,
    Col: Col,
    colgroup: colgroup,
    Colgroup: Colgroup,
    TableSection: TableSection,
    TableCell: TableCell,
    thead: thead,
    tbody: tbody,
    tfoot: tfoot,
    td: td,
    th: th,
    tr: tr,
    TableRow: TableRow,
    cite: cite,
    Cite: Cite,
    code: code,
    Code: Code,
    dl: dl,
    dt: dt,
    dd: dd,
    Dl: Dl,
    Dt: Dt,
    Dd: Dd,
    details: details,
    Details: Details,
    summary: summary,
    Summary: Summary,
    dfn: dfn,
    Dfn: Dfn,
    div: div,
    Div: Div,
    em: em,
    Em: Em,
    ital: ital,
    Ital: Ital,
    i: i,
    strong: strong,
    Strong: Strong,
    embed: embed,
    Embed: Embed,
    noembed: noembed,
    NoEmbed: NoEmbed,
    fieldset: fieldset,
    Fieldset: Fieldset,
    legend: legend,
    Legend: Legend,
    figure: figure,
    Figure: Figure,
    figcaption: figcaption,
    FigCaption: FigCaption,
    form: form,
    Form: Form,
    frame: frame,
    frame2: frame2,
    frameset: frameset,
    Frame: Frame,
    Frameset: Frameset,
    noframes: noframes,
    NoFrames: NoFrames,
    iframe: iframe,
    IFrame: IFrame,
    iframe2: iframe2,
    ins: ins,
    Ins: Ins,
    kbd: kbd,
    Kbd: Kbd,
    label: label,
    label2: label2,
    Label: Label,
    ul: ul,
    ol: ol,
    li: li,
    List: List,
    ListItem: ListItem,
    mark: mark,
    Mark: Mark,
    noscript: noscript,
    NoScript: NoScript,
    select: select,
    Select: Select,
    OptionGroup: OptionGroup,
    optgroup: optgroup,
    Option: Option,
    option: option,
    output: output,
    Output: Output,
    p: p,
    Paragraph: Paragraph,
    paragraph: paragraph,
    pre: pre,
    Pre: Pre,
    q: q,
    Quoted: Quoted,
    s: s,
    strike: strike,
    Strike: Strike,
    script: script,
    Script: Script,
    script2: script2,
    small: small,
    Small: Small,
    source: source,
    Source: Source,
    source2: source2,
    sub: sub,
    Sub: Sub,
    sup: sup,
    Sup: Sup,
    textarea: textarea,
    Textarea: Textarea,
    time: time,
    Time: Time,
    track: track,
    Track: Track,
    track2: track2,
    variable: variable,
    Var: Var,
    video: video,
    VideoTag: VideoTag,
    video2: video2,
    wbr: wbr,
    Wbr: Wbr,
    main: main,
    Main: Main
  });

  window.BaseElement = BaseElement;
  window.Tag = Tag;
  window.TagEmpty = TagEmpty;
  window.render = render;
  window.html = _objectSpread2({
    addRequiredRole,
    addRequiredClasses
  }, html);
  window.__htmlSaver = {};

  window.html.registerGlobal = () => {
    for (var key in window.html) {
      window.__htmlSaver[key] = window[key];
      window[key] = window.html[key];
    }
  };

  window.html.restoreGlobal = () => {
    for (var key in window.__htmlSaver) {
      window[key] = window.__htmlSaver[key];
    }
  };

}());
