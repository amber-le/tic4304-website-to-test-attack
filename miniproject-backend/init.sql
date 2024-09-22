create table if not exists form
(
    full_name     varchar(255) not null,
    email         varchar(255) not null
        primary key,
    phone_number  int          not null,
    country       varchar(255) not null,
    gender        int          not null,
    qualification text         not null
);

create table if not exists users
(
    name     varchar(255) not null,
    email    varchar(255) not null
        primary key,
    password varchar(255) not null
);

