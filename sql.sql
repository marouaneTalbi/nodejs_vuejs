-- Création de la table skin
CREATE TABLE skin (
  id INT PRIMARY KEY,
  title VARCHAR(255),
  picture VARCHAR(255),
  price DECIMAL(10,2),
  mony_type VARCHAR(255)
);

-- Créer une séquence pour la colonne id
CREATE SEQUENCE user_id_seq;

-- Créer la table _user avec une colonne id auto-incrémentée
CREATE TABLE _user (
  id INT DEFAULT nextval('user_id_seq') PRIMARY KEY,
  pseudo VARCHAR(255) NOT NULL,
  mail VARCHAR(255),
  password VARCHAR(255),
  forgot_pwd VARCHAR(255),
  picture VARCHAR(255),
  coins INT,
  ratio DECIMAL(10,2),
  role VARCHAR(255),
  verificationcode INT,
  token VARCHAR,
  isconfirmed BOOLEAN DEFAULT false,
  points INT,
  skins_fk_id INT,
  createdat TIMESTAMP
  FOREIGN KEY (skins_fk_id) REFERENCES skin(id)
);

-- Création de la table grade
CREATE TABLE grade (
  id INT PRIMARY KEY,
  title VARCHAR(255),
  required_points INT,
  picture VARCHAR(255)
);

-- Création de la table gamemode
CREATE TABLE gamemode (
  id INT PRIMARY KEY
);

-- Création de la table tournoi
CREATE TABLE tournament (
  id INT PRIMARY KEY
);

-- Création de la table chat
CREATE TABLE chat (
  id INT PRIMARY KEY
);

-- Création de la table game
CREATE TABLE game (
  id INT PRIMARY KEY,
  code VARCHAR(255),
  game_mode_fk_id INT,
  chat_fk_id INT,
  FOREIGN KEY (game_mode_fk_id) REFERENCES gamemode(id),
  FOREIGN KEY (chat_fk_id) REFERENCES chat(id)
);

-- Création de la table payment
CREATE TABLE payment (
  id INT PRIMARY KEY
);

-- Création de la relation many-to-many entre user et skin
CREATE TABLE user_skin (
  user_id INT,
  skin_id INT,
  PRIMARY KEY (user_id, skin_id),
  FOREIGN KEY (user_id) REFERENCES _user(id),
  FOREIGN KEY (skin_id) REFERENCES skin(id)
);

-- Création de la relation many-to-many entre user et game
CREATE TABLE user_game (
  user_id INT,
  game_id INT,
  PRIMARY KEY (user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES _user(id),
  FOREIGN KEY (game_id) REFERENCES game(id)
);

-- Création de la relation entre user et grade
ALTER TABLE _user ADD COLUMN grade_id INT;
ALTER TABLE _user ADD COLUMN verificationcode  INT;
ALTER TABLE _user ADD COLUMN role  VARCHAR;

ALTER TABLE _user ADD FOREIGN KEY (grade_id) REFERENCES grade(id);

-- Création de la relation entre user et payment
CREATE TABLE user_payment (
  user_id INT,
  payment_id INT,
  PRIMARY KEY (user_id, payment_id),
  FOREIGN KEY (user_id) REFERENCES _user(id),
  FOREIGN KEY (payment_id) REFERENCES payment(id)
);
