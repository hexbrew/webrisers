export function readyStateCheck(type="readystatechange", state="complete") {
  const check = () => document.readyState == state;

  return new Promise(resolve => {
      //check readyState
      //listens for readyState then removes listener on state match
      function listener() {
          if(check()){
              document.removeEventListener(type, listener);
              resolve();
          }
      }
      
      //if current state expected state resolve, else wait for it
      check() ? resolve() : document.addEventListener(type, listener);
  });
}
