const jy_storage = {
  get: (key) => {
    let data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    }
    catch(e){
      return data;
    }
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key) => {
    localStorage.removeItem(key);
  }
};


export default jy_storage;
