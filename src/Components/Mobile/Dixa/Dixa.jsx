import { useEffect } from "react";

const DixaSript = () => {
  useEffect(() => {
        (function (w, d, s) {
            if (w._dixa_) return;
            w._dixa_ = {
              invoke: function (m, a) {
                w._dixa_.pendingCalls = w._dixa_.pendingCalls || [];
                w._dixa_.pendingCalls.push([m, a]);
              },
            };
            s = d.createElement("script");
            s.type = "text/javascript";
            s.setAttribute("charset", "utf-8");
            s.async = true;
            s.src = "https://messenger.dixa.io/bootstrap.js";
            var before = d.getElementsByTagName("script")[0];
            before.parentNode.insertBefore(s, before);
        })(window, document);
        window._dixa_.invoke("init", { messengerToken: "0837bbc105a24d53ba87398c8276e0e3", hideToggler: true }); 
    },[])
}

export default DixaSript;