export const Endpoints = {
  firebase: {
    functions: "https://us-central1-movies-ba23a.cloudfunctions.net/",
    fcm: ""
  },
  api: {
    user: "http://users.api.hapy.co.in/api/",
    news: "http://news.api.hapy.co.in/api/",
    auth: "http://auth.api.hapy.co.in/api/",
    chat: "http://chat.api.hapy.co.in/api/",
    call: "http://call.api.hapy.co.in/api/",
    video: "http://video.api.hapy.co.in/api/",
    settings: "http://settings.api.hapy.co.in/api/",
    location: "http://location.api.hapy.co.in/api/",
    appsettings: "http://appsettings.api.hapy.co.in/api/",
    notification: "http://notification.api.hapy.co.in/api/"
  },
  // api: {
  //   user: "http://localhost:58501/api/",
  //   news: "http://localhost:58504/api/",
  //   auth: "http://localhost:52584/api/",
  //   chat: "http://localhost:54828/api/",
  //   call: "http://call.api.hapy.co.in/api/",
  //   video: "http://video.api.hapy.co.in/api/",
  //   settings: "http://settings.api.hapy.co.in/api/",
  //   location: "http://localhost:58531/api/",
  //   appsettings: "http://localhost:62693/api/",
  //   notification: "http://localhost:62981/api/"
  // },
  apisubpath: {
    user: {},
    auth: {
      otp: {
        sendonmobile: "sendonmobile",
        sendonemail: "sendonemail",
        checksmstosend: "checksmstosend"
      }
    },
    notification: {
      device: {
        getsupportedlist: "getsupportedlist",
        register: "register",
        settoken: "settoken"
      }
    }
  },
  vendor: {
    restcountriesapi: "https://restcountries.eu/rest/v2/all?fields="
  }
};
