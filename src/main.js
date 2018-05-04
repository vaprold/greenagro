/**
 * Поиск кнопок открытия/закрытия попапов
 * @type {NodeList}
 */
var popupBtns = document.querySelectorAll(".close-btn, .popup-btn");

/**
 * Объект, занимающий работой с кукис из библиотеки browser-cookies
 * @type {browser-cookies}
 */
var browserCookies = require('browser-cookies');

/**
 * Отрисовка гулокарты
 */
function initMap(isContacts) {
  var isMobile = (window.screen.width <= 650);
  // alert ('Screen: ' + window.screen.width + 'px x ' + window.screen.height + 'px, isMobile: ' + isMobile + ', isContacts: ' + isContacts);
  var msk = isMobile ? {lat: 55.828903, lng: 37.577989} : isContacts ? {lat: 55.743717, lng: 37.670498} : {lat: 55.709623, lng: 37.593688};
  var office = {lat: 55.678803, lng: 37.253474};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: isMobile ? 9 : isContacts ? 10 : 11,
    center: msk,
    scrollwheel:  false
  });
  // if (isContacts) {map.zoom = 10;}
  // if (isMobile) {map.zoom = 9;}
// };

  var image = {
  url: 'img/map-point.png',
  // This marker is 20 pixels wide by 32 pixels high.
  size: new google.maps.Size(231, 190),
  // The origin for this image is (0, 0).
  origin: new google.maps.Point(0, 0),
  // The anchor for this image is the base of the flagpole at (0, 32).
  anchor: new google.maps.Point(50, 190)
};
  var marker = new google.maps.Marker({
    position: office,
    icon: image,
    map: map
  });
}

/**
 * Отрисовка гулокарты на странице контактов
 */
function initContactsMap() {
  var isContacts = true;
  initMap(isContacts);
}


/**
 * Переключает класс "shown" у заданного элемента
 * @param {Node} pageBlock
 */
var shownToggle = function (pageBlock) {
  pageBlock.classList.toggle('shown');
}

/**
 * Обработчик события "click" для кнопок открытия и закрытия попапов
 * Читает атрибут "type" кнопки, а если его не находит, пытается найти родителя, имеющегго класс "popup"
 * Переключает класс видимости соответствующего попапа.
 * Если не задан атрибут и не найден подходящий родитель, то редиректит на страницу из href
 * @param {Event} event
 */
var popupBtnsClick = function (event) {
  event.preventDefault();
  var selector = event.currentTarget.dataset.type;
  var popup = (selector) ? document.querySelector('.popup-' + selector) : getParentPopup(event.currentTarget);
  if (popup) {
    shownToggle(popup)
  } else {
    location.href = this.href;
  } ;
}

/**
 * Рекурсивный поиск родителя, содержащего класс "popup"
 * @param {Node} element
 */
var getParentPopup = function (element) {
  var parentNode = element.parentNode;
  if (parentNode != document) {
    return (parentNode.classList.contains('popup')) ? parentNode : getParentPopup(parentNode);
  }
}

/**
 * Блок работы с языковыми штуками
 */
var langFeatures = function () {
  /**
   * Перечисление языков с классами интерфейса
   * @enum {String}
   */
  var LangClass = {
    'ru': {name: 'Рус', className: 'lang-rus'},
    'en': {name: 'Eng', className: 'lang-eng'}
  }

  /**
   * Язык интерфейса
   * @type {String}
   */
  var userLanguage = 'ru';

  /**
   * Кнопка выбора языка
   * @type {Node}
   */
  var langBtn = document.querySelector('.language-block > .language');

  /**
   * Список языков
   * @type {Node}
   */
  var langList = document.querySelector('.language-list');

  /**
   * Языки
   * @type {NodeList}
   */
  var langListItems = document.querySelectorAll('.language-list .language');

  /**
   * Чтение куков и определения языка интерфейса
   */
  var readLanguage = function () {
    var lang = browserCookies.get('lang') || 'ru';
    return lang;
  }

  /**
   * Установка куков перед выходом со страницы
   */
  var saveLanguage = function () {
    browserCookies.set('lang', userLanguage, {expires: 30});
  }

  /**
   * Установка языка страницы
   */
  var setLanguage = function (lng) {
    if (userLanguage != lng) {
       langBtn.classList.remove(getClass(langBtn.classList));
       langBtn.classList.add(LangClass[lng].className);
       langBtn.textContent = LangClass[lng].name;
       userLanguage = lng;
    }
  }

  /**
   * Поиск класса, определяющего язык
   * @param {classList}
   * @return {String}
   */
  var getClass = function(classList) {
    var className;

    for (var i = 0; i < classList.length; i++) {
      className = classList[i].substr(0,5) == 'lang-' ? classList[i] : null;
    }

    return className;
  }

  /**
   * Определение языка по имени класса
   * @param {String}
   * @return {String}
   */
  var getClassLanguage = function(className) {
    for (var lng in LangClass) {
      if (LangClass[lng].className == className) {return lng}
    }
  }

  /**
   * Обработчик кликов по документу
   * Если клик сделан за пределами блока выбора языка, скрывает блок и отключает обработчик
   * @param {Event}
   */
  var documentListener = function(evt) {
      langList.classList.remove('shown');
      document.removeEventListener('click', documentListener);
  }

  setLanguage(readLanguage());

  // установка обработчика на "unload" для записи куков
  window.addEventListener('unload', saveLanguage);

  // установка обработчика на кнопку выбора языка
  langBtn.addEventListener('click', function(evt) {
    shownToggle(langList);

    document.addEventListener('click', documentListener);

    evt.stopPropagation();
  });

  // установка обработчиков клика на языки
  for (var i = 0; i < langListItems.length; i++) {
    langListItems[i].addEventListener('click', function(evt) {
      var newLang = getClassLanguage(getClass(evt.target.classList));
      setLanguage(newLang);
    });
  }

}();

//отрисовка гулокарты
window.initMap = initMap;
window.initContactsMap = initContactsMap;

// Установка обработчиков событий на кнопки попапов
for (var i = 0; i < popupBtns.length; i++)  {
    popupBtns[i].addEventListener("click", popupBtnsClick);
}
