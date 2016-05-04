<html>
<title>MySql Viewer</title>

<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
<link rel="stylesheet" href="DB.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
<script src="DBmodule.js"></script>
<script>
	jQuery(document).ready(function () {console.log("main");
    	if($('[data-module="DBmodule"]')[0]) $('[data-module="DBmodule"]').DBmodule();
	});
</script>

<body>
<div>
    <div id="header">
        <select id="dbs"></select>
        <div id="title">
            <div>MySql Viewer (<?= $_SERVER['HTTP_HOST']; ?>)</div>
        </div>
    </div>
</div>

<div id="container" data-module="DBmodule">
    <div id="nav">

        <div id="div_tables">
            <ul id="tables"></ul>
        </div>
        <div id="div_fields">
            <ul id="fields"></ul>
        </div>
        <div style="clear: both;"></div>
    </div>

    <div id="right_panel">
        <div id="sql">
            <div id="query-content">
                <textarea id="query"></textarea>
            </div>
        </div>
        <div id="result"></div>
    </div>
    <div style="clear: both;"></div>
    <div id="run">
        <button>Run</br/>query</button>
    </div>
</div>


<div>
    <div id="footer">
        MySql Viewer (<?= $_SERVER['HTTP_HOST']; ?>)
    </div>
</div>
<div class='loader'></div>
</body>

</html>
