Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling)
}

function noop() {}

function _createModalFooter(buttons = []) {
  if (buttons.length === 0) {
    return document.createElement('div')
  }

  const wrap = document.createElement('div')
  wrap.classList.add('modal-footer')

  buttons.forEach(btn => {
    const $btn = document.createElement('button')
    $btn.textContent = btn.text
    $btn.classList.add('mui-btn')
    $btn.classList.add('mui-btn--raised')
    $btn.classList.add(`mui-btn--${btn.type || 'secondary'}`)
    $btn.addEventListener('click', btn.handler || noop, {once: true})
    // $btn.onclick = btn.handler || noop
    wrap.appendChild($btn)
  })

  return  wrap
}

function _createModal(options) {
  const DEFAULT_WIDTH = '600px'
  const modal = document.createElement('div')
  modal.classList.add('vmodal')
  modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay" data-close="true">
      <div class="modal-window" style="${options.width || DEFAULT_WIDTH}">
          <div class="modal-header">
              <span class="modal-title" data-title>${options.title || 'Window'}</span>
              ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : '' }
          </div>
          <div class="modal-body" data-content>
              <p>${options.content || ''}</p>
          </div>
      </div>
    </div>
  `)
  const footer = _createModalFooter(options.footerButtons)
  footer.appendAfter(modal.querySelector('[data-content]'))
  document.body.appendChild(modal)
  return modal
}

export function modal(options) {
  const ANIMATION_SPEED = 200
  const $modal = _createModal(options)
  let closing = false
  let destroyed = false

  const modal = {
    open() {
      if (destroyed) console.log('Model is destroyed');
      !closing && $modal.classList.add('open')
    },
    close() {
      closing = true
      $modal.classList.remove('open')
      $modal.classList.add('hiding')
      setTimeout(() => {
        $modal.classList.remove('hiding')
        closing = false
        if (typeof options.onClose === 'function'){
          options.onClose()
        }
      }, ANIMATION_SPEED)
    },

  }
  const listener = event => {
    //console.log(event.target.getAttribute('data-close'));
    if (event.target.dataset.close) {
      modal.close()
    }
  }

  $modal.addEventListener('click', listener)

  return Object.assign(modal, {
    destroy() {
      $modal.parentNode.removeChild($modal)
      $modal.removeEventListener('click', listener)
      destroyed = true
    },
    setContent(html) {
      $modal.querySelector('[data-content]').innerHTML = html
    },
    setTitle(html) {
      $modal.querySelector('[data-title]').innerHTML = html
    }
  })
}