function generateOpenTag(href, className = '', origin, related, attr = 'src') {
  const id = href.split(':')[1];
  const originParam = origin ? `origin=${origin}` : '';
  const relParam = typeof related === 'boolean' ?
    `rel=${related ? 1 : 0}` :
    '';
  const params = originParam || relParam ?
    `?${[originParam, relParam].filter(p => !!p).join('&')}` :
    '';

  return `<div class="remarkable-youtube-wrapper">
    <iframe class="remarkable-youtube ${className}"
            ${attr}="https://www.youtube.com/embed/${id}${params}"
            frameborder="0"
            allow="encrypted-media"
            allowfullscreen></iframe>
  </div>`;
}

function isPDFLink(href) {
  return href.indexOf('pdf:') === 0;
}

const remarkablePDF = (md, config = {}) => {
  const originalLinkOpenRenderer = md.renderer.rules.link_open;
  const originalLinkCloseRenderer = md.renderer.rules.link_close;

  md.renderer.rules.link_open = (tokens, idx, options, env) => {
    const href = tokens[idx].href;

    if (isPDFLink(href)) {
      env.youtube = true;
      return generateOpenTag(href, config.className, config.origin, config.related, config.attr);
    }

    return originalLinkOpenRenderer(tokens, idx, options, env);
  };

  md.renderer.rules.link_close = (tokens, idx, options, env) => {
    if (env.youtube) {
      env.youtube = false;
      return '</iframe>';
    }

    return originalLinkCloseRenderer(tokens, idx, options, env);
  };
};

module.exports = remarkablePDF;
