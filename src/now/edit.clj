(ns now.edit
  (:require 
    [me.raynes.conch 
     :refer [programs with-programs let-programs] 
     :as sh]
    [clojure.java.io :as io]
    [clojure.core.async :refer [chan go >!] :as async]))

(programs gvim)

(defn launch [tick]
  (let [file (str "/tmp/now-" tick) out (async/chan)]
    (go
      (gvim file)
      (>! out (try (slurp file)
                   (catch Exception e "")))
      (try (io/delete-file file)
           (catch Exception e "")))
    out))
