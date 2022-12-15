MYSQL_CONT_NAME="Accelerator_cont_MySql"
MONGO_CONT_NAME="Accelerator_cont_Mongo"

npm install 
docker stop $MYSQL_CONT_NAME
#rm -rf $MYSQL_CONT_NAME
mkdir $MYSQL_CONT_NAME
#
docker run --rm --name $MYSQL_CONT_NAME -p 3021:3306 -e MYSQL_ROOT_PASSWORD=$SQL_CNX \
--mount type=bind,src=$(pwd)/$MYSQL_CONT_NAME,dst=/var/lib/mysql \
-d mysql:8.0
docker ps 

docker logs Accelerator_cont_MySql 2>&1| grep "/usr/sbin/mysqld: ready for connections." 2>/dev/null 

while [ ! $? -eq 0 ]
do 
 echo sleep 2
 sleep 2
 docker logs Accelerator_cont_MySql 2>&1| grep "/usr/sbin/mysqld: ready for connections." 2>/dev/null 
 
done
 
echo $MYSQL_CONT_NAME container started

docker cp ./MySQL_CreateDB.sql $MYSQL_CONT_NAME:/tmp
docker cp ./MySQL_Insterdata.sql $MYSQL_CONT_NAME:/tmp
# create init shell script 
#   can't use redirection on docker cli, hence create and call shell scrip tinstead
PW_VAR='$SQL_CNX'
echo "mysql -uroot -p$PW_VAR <./MySQL_CreateDB.sql" > ini_MySql_DB.sh
echo "mysql -uroot -p$PW_VAR <./MySQL_Insterdata.sql" >> ini_MySql_DB.sh
docker cp ./ini_MySql_DB.sh $MYSQL_CONT_NAME:/tmp
rm ./ini_MySql_DB.sh
docker exec -e SQL_CNX=$SQL_CNX -w /tmp $MYSQL_CONT_NAME bash ini_MySql_DB.sh


# docker run --name some-mongo -d mongo:tag
#docker run --name mongodb -d -p 27017:27017 mongo
#docker run --name mongodb -d -v YOUR_LOCAL_DIR:/data/db mongo
#docker run --name mongodb -d --network mynetwork mongo
#docker run --name mongodb -d -e MONGO_INITDB_ROOT_USERNAME=AzureDiamond -e MONGO_INITDB_ROOT_PASSWORD=hunter2 mongo


# set other container to access to mongo service container
#not (yet) usefull in our current case
#docker run -d --name MYAPP -e MONGODB_CONNSTRING=mongodb+srv://username:password@clusterURL MYAPP:1.0

#Set env for Mongo server and share/use it with Nodejs
#const connString = process.env.MONGODB_CONNSTRING;

MONGO_CONT_NAME="Accelerator_cont_Mongo"
docker stop $MONGO_CONT_NAME
#rm -rf $MONGO_CONT_NAME
mkdir $MONGO_CONT_NAME

docker run --rm --name $MONGO_CONT_NAME -p 3022:27017 -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=$SQL_CNX \
--mount type=bind,src=$(pwd)/$MONGO_CONT_NAME,dst=/data/db \
-d mongo:6.0

note MongoDB_insertdata.js




# Managing MongoDB from a Container

# To manage your MongoDB server or to access, import, and export your data, 
# you can use a second MongoDB container from which you will run the necessary CLI tools.

# To open up a Mongo Shell session to your MongoDB Atlas server, use mongosh and specify the cluster URL.

# docker run -it mongo:5.0 mongosh "mongo+srv://username:password@clusterURL/database"
# If you want to use the mongoexport tool to export an existing collection to a .json file, you can use the command from a separate MongoDB container. You will need to mount a volume to be able to access the resulting JSON file.

# docker run -it -v $(pwd):/tmp mongo:5.0 mongoexport --collection=COLLECTION --out=/tmp/COLLECTION.json "mongo+srv://username:password@clusterURL/database"
# If you need to import data into a collection, you use the mongoimport tool, also available from the mongo image. Again, you will need to mount a volume to access a file stored on your local machine from inside the container.

# docker run -it -v $(pwd):/tmp mongo:5.0 mongoimport --drop --collection=COLLECTION "mongodb+srv://user:password@clusterURL/database" /tmp/COLLECTION.json