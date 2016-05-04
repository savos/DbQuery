<?php 

require_once("config.php");

function getDatabases()
{
	global $DB;
	$ret = array();
	foreach( $DB as $key => $value ) 
	{
		$ret[] = $key;//$Dbase["DB_BASE"];
	}
	return json_encode( $ret );
}

   
function getTables( $db )
{
	global $DB;
	$tables = array();

	$dbconn = new PDO("mysql:host=".$DB[$db]["DB_HOST"].";dbname=".$DB[$db]["DB_BASE"].";",$DB[$db]["DB_USER"], $DB[$db]["DB_PASS"] );
	$sql = "SHOW TABLES FROM ".$DB[$db]["DB_BASE"];
	$dbconn->prepare($sql);
	$STH = $dbconn->query($sql);
	$STH->setFetchMode(PDO::FETCH_NUM);

	while($row = $STH->fetch()) {
		$tables[] = $row[0];
	}
	return json_encode( $tables );
}


function getData( $db, $query )
{
	global $DB;
	$rows = array();

	$dbconn = new PDO("mysql:host=".$DB[ $db ][ "DB_HOST" ].";dbname=".$DB[ $db ][ "DB_BASE" ].";",$DB[ $db ][ "DB_USER" ], $DB[ $db ][ "DB_PASS" ] );
	$query = stripslashes( $query ); 

	try {
		$dbconn->prepare( $query );
		$STH = $dbconn->query( $query );
		$STH->setFetchMode( PDO::FETCH_ASSOC );
		//$rows[] = $query;
		while( $row = $STH->fetch() ) {
			$rows[] = $row;
		}
		$status = "OK";
	} catch( PDOException $pdo_error ) {
		$status = $pdo_error->getMessage();
	}

	$log = $_SERVER['REMOTE_ADDR']."; ".date('m/d/Y h:i:s a', time())."; ".$status."; ".$query."\r\n";
	file_put_contents( "DBadmin.log", $log, FILE_APPEND ); 

	return json_encode( $rows );
}


function getTableDesc( $db, $table )
{
	global $DB;
	$fields = array();
	$query = "SELECT * FROM ".$table." LIMIT 1;";

	$fields[] = "*";

	$dbconn = new PDO("mysql:host=".$DB[ $db ][ "DB_HOST" ].";dbname=".$DB[ $db ][ "DB_BASE" ].";",$DB[ $db ][ "DB_USER" ], $DB[ $db ][ "DB_PASS" ] );
	$query = stripslashes( $query ); 

	$dbconn->prepare( $query );
	$STH = $dbconn->query( $query );
	$STH->setFetchMode( PDO::FETCH_ASSOC );
	$row = $STH->fetch();

	foreach( $row as $key => $value ){
		$fields[] = $key;
	}

	return json_encode( $fields );
}


function logAction( $query, $status="OK" )
{
	$log = exec('whoami')."; ".date('m/d/Y h:i:s a', time())."; ".$status."; ".$query;
	file_put_contents( "~/DBadmin.log", $log, FILE_APPEND );
}


// Begin rest code
if( isset( $_POST['action'] ) )
{
	$data = $_POST;

	switch( $_POST['action'] )
	{
		case "getDatabases"    :    echo( getDatabases() ); 
									break;

		case "getTables"       :    echo( getTables( $_POST['dbase'] ) );
									break;

		case "getData"         :    echo( getData( $_POST['dbase'], $_POST['query'] ));
									break;

		case "getTableDesc"    :    echo( getTableDesc( $_POST['dbase'], $_POST['table'] ));
									break;


/*        case "log"             :    logAction( $_POST['query'] );
									break;*/

		default : print_r("{ 'error' : 'ERROR: Required action don't exist !' }"."     ");
		break;
	}
}
else
{
	echo("{ 'error' : 'ERROR: Action not defined !' }"."     ");
}


?>
