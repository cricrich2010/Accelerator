MYSQL_CONT_NAME="Accelerator_cont_MySql"

docker stop $MYSQL_CONT_NAME
npm install
#rm -rf $MYSQL_CONT_NAME
mkdir $MYSQL_CONT_NAME
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
#docker exec -e SQL_CNX=$SQL_CNX -w /tmp $MYSQL_CONT_NAME mysql -uroot -p$SQL_CNX "<./MySQL_Insterdata.sql"





# docker run --name some-mongo -d mongo:tag

