/*! 
 * Metro 4 Definitions for RenderJS - Create html page in pure js
 * https://pimenov.com.ua
 *
 * Copyright 2021 Serhii Pimenov
 * Released under the MIT license
 */

(function () {
    'use strict';

    class Accordion extends html.Div {
      constructor(children = '', options = {}) {
        super(children, html.addRequiredRole('accordion', options));
      }

    }
    const accordion = (children = '', options = {}) => new Accordion(children, options);
    class AccordionFrame extends html.Div {
      constructor(title = '', children = '', options = {}) {
        const className = html.addRequiredClasses('frame', options.className);
        super(children, { ...options,
          className
        });
        this.title = title;
      }

      template(content) {
        return `
            <${this.tag} ${this.attributes().join(" ")} ${this.events}>
                <div class="heading">${this.title}</div>
                <div class="content">${content}</div>
            </${this.tag}>
        `;
      }

    }
    const accordionFrame = (title = '', children = '', options = {}) => new AccordionFrame(title, children, options);

    var html$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accordion: accordion,
        accordionFrame: accordionFrame
    });

    window.metroHtml = { ...html$1
    };
    if (!window.__metroHtmlSaver) window.__metroHtmlSaver = {};

    window.metroHtml.registerGlobal = () => {
      for (let key in window.metroHtml) {
        window.__metroHtmlSaver[key] = window[key];
        window[key] = window.metroHtml[key];
      }
    };

    window.metroHtml.restoreGlobal = () => {
      for (let key in window.__metroHtmlSaver) {
        window[key] = window.__metroHtmlSaver[key];
      }
    };

}());
