drop table if exists tag; 

create table tag (
		id integer auto_increment,
        file_id varchar(255),
        scan_id varchar(255),
        album varchar(255),
        artist varchar(255),
        genre varchar(255),
        title varchar(255),
        track varchar(255),
        year varchar(255),
		path varchar(255),
        image blob,
		mimetype varchar(255),
        uncommitted_album varchar(255),
        uncommitted_artist varchar(255),
        uncommitted_genre varchar(255),
        uncommitted_title varchar(255),
        uncommitted_track varchar(255),
        uncommitted_year varchar(255),
        uncommitted_mimetype varchar(255),
        uncommitted_image blob,
        primary key (id)
);

drop table if exists scan; 

create table scan ( 
	scan_id varchar(255),
	start timestamp, 
	finish timestamp, 
	source varchar(255), 
	primary key (scan_id)
);

drop table if exists options; 

create table options (
	id integer auto_increment, 
	name varchar(255), 
	value varchar(255), 
	primary key (id)
)