DROP DATABASE IF EXISTS MyAccelerator;
CREATE DATABASE IF NOT EXISTS MyAccelerator;

use MyAccelerator;

DROP TABLE IF EXISTS Subscriptions;
DROP TABLE IF EXISTS Trials;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Accounts;

CREATE TABLE Accounts (
login varchar(32) not null,
email varchar(128) not null,
password varchar(512),
PRIMARY KEY (login),
UNIQUE (email)
);

CREATE TABLE Roles (
role ENUM ('Admin', 'ctm', 'investigator', 'patient') not null,
login varchar(32) not null,
status ENUM ('requested', 'accepted', 'revoked', 'rejected') default 'requested',
certificatelink varchar(4096),
PRIMARY KEY (role, login)
);

ALTER TABLE Roles ADD CONSTRAINT FK_Roles_login FOREIGN KEY (login) REFERENCES Accounts (login);

CREATE TABLE Trials (
trialcode varchar(16),
description varchar(4096),
status ENUM ('start','open','ongoing', 'closed'),
PRIMARY KEY (trialcode)
);

CREATE TABLE Subscriptions (
trialcode varchar(16) NOT NULL,
role ENUM ('Admin', 'ctm', 'investigator', 'patient') not null,
login varchar(32) NOT NULL,
investigatorlogin varchar(32),
PRIMARY KEY (trialcode, role, login)
);

ALTER TABLE Subscriptions ADD CONSTRAINT FK_Subscriptions_trialcode FOREIGN KEY (trialcode) REFERENCES Trials (trialcode);
ALTER TABLE Subscriptions ADD CONSTRAINT FK_Subscriptions_rolelogin FOREIGN KEY (role, login) REFERENCES Roles (role, login);
ALTER TABLE Subscriptions ADD CONSTRAINT FK_Subscriptions_investigator FOREIGN KEY (investigatorlogin) REFERENCES Accounts (login);




