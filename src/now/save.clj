(ns now.save
  (:require 
            [clojure.java.jdbc :as sql]
            [korma.db :as db :refer :all]
            [korma.core :as korma :refer :all]))

(defdb sqldb (sqlite3 { :db "./now.db" }))

(defentity ticks)

(defn setup []
  (exec-raw sqldb "create table if not exists
                  ticks (time integer, status text)" :keys))

(defn tick [time status]
  (insert ticks (values {:time time :status status})))
