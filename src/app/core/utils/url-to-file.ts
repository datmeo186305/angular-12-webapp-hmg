import * as Sentry from '@sentry/angular';

const urlToFile = (url, filename, mimeType) => {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    })
    .catch((e) => {
      Sentry.captureException(e);
    });
};

export default urlToFile;
