var cart = {};
 
// ===================== CART DRAWER =====================
 
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
 
function addToCart(name, price) {
  if (cart[name]) {
    cart[name].qty += 1;
  } else {
    cart[name] = { price: price, qty: 1 };
  }
  renderCart();
  animateBadge();
  openCart();
}
 
function changeQty(name, delta) {
  if (!cart[name]) return;
  cart[name].qty += delta;
  if (cart[name].qty <= 0) delete cart[name];
  renderCart();
}
 
function removeItem(name) {
  delete cart[name];
  renderCart();
}
 
function clearCart() {
  cart = {};
  renderCart();
}
 
function renderCart() {
  var container = document.getElementById('cartItems');
  var emptyMsg  = document.getElementById('cartEmpty');
  var footer    = document.getElementById('cartFooter');
  var badge     = document.getElementById('cartBadge');
  var label     = document.getElementById('cartBtnLabel');
 
  var keys       = Object.keys(cart);
  var totalItems = keys.reduce(function(s, k) { return s + cart[k].qty; }, 0);
  var totalPrice = keys.reduce(function(s, k) { return s + cart[k].price * cart[k].qty; }, 0);
 
  // Update badge & button label
  badge.textContent = totalItems;
  if (totalItems > 0) {
    badge.classList.add('visible');
    label.textContent = 'Bag (' + totalItems + ')';
  } else {
    badge.classList.remove('visible');
    label.textContent = 'Bag';
  }
 
  // Remove existing item elements
  container.querySelectorAll('.cart-item').forEach(function(el) { el.remove(); });
 
  if (keys.length === 0) {
    emptyMsg.style.display = '';
    footer.style.display = 'none';
  } else {
    emptyMsg.style.display = 'none';
    footer.style.display = '';
 
    keys.forEach(function(name) {
      var price = cart[name].price;
      var qty   = cart[name].qty;
      var el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML =
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + name + '</div>' +
          '<div class="cart-item-price">&#8377;' + (price * qty).toLocaleString('en-IN') + '</div>' +
          '<div class="cart-item-qty">' +
            '<button class="qty-btn" onclick="changeQty(\'' + name + '\', -1)">&#8722;</button>' +
            '<span class="qty-val">' + qty + '</span>' +
            '<button class="qty-btn" onclick="changeQty(\'' + name + '\', 1)">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="removeItem(\'' + name + '\')" title="Remove">&#10005;</button>';
      container.appendChild(el);
    });
 
    document.getElementById('cartTotal').textContent = '₹' + totalPrice.toLocaleString('en-IN');
  }
}
 
function animateBadge() {
  var badge = document.getElementById('cartBadge');
  badge.classList.remove('pop');
  void badge.offsetWidth; // force reflow to restart animation
  badge.classList.add('pop');
}
 
// ===================== NEWSLETTER =====================
 
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
 
function clearEmailError() {
  var emailInput = document.getElementById('subEmail');
  var emailError = document.getElementById('emailError');
  emailInput.classList.remove('input-error');
  emailError.classList.remove('show');
}
 
function handleSubscribe() {
  var nameInput  = document.getElementById('subName');
  var emailInput = document.getElementById('subEmail');
  var nameError  = document.getElementById('nameError');
  var emailError = document.getElementById('emailError');
  var valid = true;
 
  if (!nameInput.value.trim()) {
    nameInput.classList.add('input-error');
    nameError.classList.add('show');
    valid = false;
  } else {
    nameInput.classList.remove('input-error');
    nameError.classList.remove('show');
  }
 
  if (!isValidEmail(emailInput.value)) {
    emailInput.classList.add('input-error');
    emailError.classList.add('show');
    valid = false;
  } else {
    emailInput.classList.add('input-success');
    emailInput.classList.remove('input-error');
    emailError.classList.remove('show');
  }
 
  if (!valid) return;
 
  document.getElementById('newsletterFormWrap').style.display = 'none';
  document.getElementById('subscribeSuccess').style.display = 'block';
}
 
// ===================== STATS COUNTER ANIMATION =====================
 
window.addEventListener('load', function() {
  var statsEl = document.querySelector('.about-stats');
  if (!statsEl) return;
 
  function animateStats(el) {
    el.querySelectorAll('.num[data-target]').forEach(function(numEl) {
      var target    = parseFloat(numEl.dataset.target);
      var suffix    = numEl.dataset.suffix || (numEl.dataset.target === '10' ? 'M+' : '');
      var isDecimal = numEl.dataset.decimal === 'true';
      var current   = 0;
      var increment = target / 50;
 
      var timer = setInterval(function() {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        numEl.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
      }, 1400 / 50);
    });
  }
 
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      animateStats(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
 
  // Run immediately if already in view, otherwise observe
  var rect = statsEl.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    animateStats(statsEl);
  } else {
    observer.observe(statsEl);
  }
});