<?php
// php function to convert csv to json format
function csvToJson($fname) {
    // open csv file
    if (!($fp = fopen($fname, 'r'))) {
        die("Can't open file...");
    }
    
    //read csv headers
    $key = fgetcsv($fp,"1024",";");

    $nokey = array();
    for ($index = 0; $index < count($key); $index++) {
        array_push($nokey, (string)($index));
    }
    // parse csv rows into array
    $json = array();
    while ($row = fgetcsv($fp,"1024",";")) {
        $json[] = array_combine($nokey, $row);
    }
    //echo count($json);
    // release file handle
    fclose($fp);

    //get only 10 rows with random start
    $row_count = 50;
    $start = rand(0, count($json) - 1 - $row_count);
    $result = array_reverse(array_slice($json, $start, $row_count));
    // encode array to json
    return json_encode($result);
}

//send json string to front-end
echo csvToJson('./data/csv.log');

?>