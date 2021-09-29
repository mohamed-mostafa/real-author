const _ = require("lodash");
const { SUPPORTED_LANGUAGES } = require("../../config/constants/languages");

class Translation {
  toLanguage(data, language) {
    if (_.isNil(data)) {
      return;
    }
    if (!_.isObject(data)) {
      return data;
    }
    if (data.translation && data.translation[language]) {
      const translationKeys = Object.keys(data.translation[language]);
      for (let j = 0; j < translationKeys.length; j++) {
        data[translationKeys[j]] =
          data.translation[language][translationKeys[j]];
      }
    }
    delete data.translation;
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      data[keys[i]] = this.toLanguage(data[keys[i]], language);
    }
    return data;
  }
}
module.exports = new Translation();
