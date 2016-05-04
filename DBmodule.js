(function ( $, window, document, undefined ) {
				// Create the defaults once				//
				var pluginName = 'DBmodule',
						defaults = {
						path: '', //some variables that you will need will be set in here
						loader: "<div class='loader'></div>"
				};

				// The actual plugin constructor
				function Plugin ( element, options ) {
						this.element = element;
						var self=this;
						// jQuery has an extend method which merges the contents of two or
						this.settings =  $.extend( {
							message:     $(this.element).data('message-noresults'),// example of a message, just examples remove it
							searchInfo:  $(this.element).attr('data-module-searchinfo'),
						}, defaults, options );
						this._defaults = defaults;
						this._name = pluginName;
						this.init();
				}

				// Avoid Plugin.prototype conflicts
				$.extend(Plugin.prototype, {

						// Initialize module
						init : function () {
							var self = this;
							
							// load database names in combo box
							var databases = this.getDatabases();
						
							// show tables from selected database
							$( "#dbs" ).change( function () {
								self.getTables( $( "#dbs" ).find(":selected").val() );
							});
						
							// Remember last cursor possition in query
							$( "#query" ).focusout( function (){
								cursor = $( "#query" ).getCursorPosition();
								console.log("t-a offset = "+cursor );
								//$( "#query" ).focus();
							});
						
							// run query
							$( "#run" ).click( function() {
								//console.log( "run query" );
								$( "body" ).addClass( "loading" ); // show loader
								$.post( "DB.php", { 
									action: 'getData', 
									dbase: $( "#dbs option:selected" ).text(), 
									query: $( "#query" ).val() 
								}, self.showData );
						    });
					    },

						// Get list of databases
						getDatabases : function(){

							$.post( "DB.php", { action: 'getDatabases' }, function( data ) {
								try {
									data = JSON.parse( data );
								} catch( err ){
									console.log( "ERROR err = "+err+" data = "+data );
								}
								for( var i = 0; i < data.length; i++ ){
									//console.log( i + " = " + data[ i ]);
									var opt = "<option value='"+data[ i ]+"'>"+data[ i ]+"</option>";
									$( "#dbs" ).append( opt );
								}
							});
						},

						// Render data and show in panel 
						showData : function( data ) {
							
							var self = this;
							
							try {
								data = JSON.parse( data );
							} catch( err ){
								console.log( "ERROR data = " + data );
							}
							
							var table = "<table><tr class='header'>";
							var j=0;
							$.each( data[ 0 ], function( key, value ) {
								table += "<th class='header"+(j++)+"'>"+key+"</th>";
							});
							table += "</tr>";
							for( var i = 0; i < data.length; i++ )
							{
								var j = 0;
								table += "<tr>" ;
									
								$.each( data[ i ], function( key, value ) {
									table += "<td class='cell"+(j++)+"'>"+value+"</td>";
								});
								table += "</tr>";
							}
							table += "</table>"

							$( "body" ).removeClass( "loading" ); // hide loader
							$( "#result" ).html( table );

							j = 0;
							var cellWidth, headerWidth, maxWidth;
							$.each( data[ 0 ], function( key, value ){
								cellWidth = $('.cell'+j).width();
								headerWidth = $('.header'+j).width();
								maxWidth = ( cellWidth > headerWidth ) ? cellWidth : headerWidth;
								//console.log( "header"+j+" = "+headerWidth+",  cell"+j+" = "+cellWidth+",  maxWidth = "+maxWidth);
								$('.header'+j).width( maxWidth );
								$('.cell'+(j++) ).width( maxWidth );
							});
							
							self.mouseOver( "tr", "#36c", "#ddd" );
							
							/*$( "tr" ).hover( function() {
								$( this ).css( "background-color", "#36c" ); 
								$( this ).css( "color", "white" ); 
							});
						
							$( "tr" ).mouseout( function() {
								$( this ).css( "background-color", "#ddd" ); 
								$( this ).css( "color", "black"  ); 
							});*/
						},
						
						getTables : function( DBase ) {
							var self = this; 
							//console.log("dbase = "+DBase);
							// get list of tables for selected Dbase
							$.post( "DB.php", { action: 'getTables', dbase: DBase }, function( data ) {
								//console.log(JSON.stringify(data));
								try {
									data = JSON.parse( data );
								} catch( err ){
									console.log( "ERROR data = " + data );
								}
								$("#tables").html("");
								for( var i = 0; i < data.length; i++ ){
									//console.log( i + " = " + data[ i ]);
									var list = "<li title='"+data[ i ]+"'>"+data[ i ]+"</li>";
									$( "#tables" ).append( list );
								}
						
								self.mouseOver( "#tables li", "blue", "#ddd" );

								$( "#tables li" ).click( function() {
									//get table fields
									$.post( "DB.php", { action: 'getTableDesc', dbase: DBase, table: $( this ).html() }, function( fields ) {
										//add fields and show them on screen
										//fields = JSON.parse( fields );
										try {
											fields = JSON.parse( fields );
										} catch( err ){
											console.log( "ERROR fields = " + fields );
										}
										$( "#fields" ).html("");
										for( var i = 0; i < fields.length; i++ ){
											//console.log( i + " = " + data[ i ]);
											var list = "<li>"+fields[ i ]+" </li>";
											$( "#fields" ).append( list );
										}
										
										self.mouseOver( "#fields li", "cyan", "gray" );
										
										// on field click add att. name to query box
										$( "#fields li" ).click( function() {
											//console.log( $( this ).html() );
						
											var query = $('#query').val();
											var comma = true;
						
											if( query.indexOf(" * ") > -1 ){
												cursor = query.indexOf("*");
												query = query.replace( "*", "" );
												console.log("v = "+query);
												comma = false;
											}
											var text = $.trim( ( comma ? ", " : "" ) + $( this ).html() );
											console.log( "comma = '"+comma+"'"+text );
											var textBefore = query.substring(0, cursor );
											var textAfter  = query.substring( cursor, query.length);
						
											$('#query').val(textBefore + text + textAfter);
											
											cursor += text.length;// + ( comma ? 1 : 0 );
										});
									});
									
									//add table to 'FROM' section
									var query = $( '#query' ).val();
									if( query != "" ){
										var limit = query.indexOf( " LIMIT" );
										var textBefore = query.substring(0, limit );
										var textAfter  = query.substring( limit, query.length);
										$( '#query' ).val( textBefore + ", " + $( this ).html() + textAfter );
									}
									
						
								});
						
								// create and execute initial query on table (select * limit 100)
								$( "#tables li" ).dblclick( function() {
									//if( !$("#query").val() ) {
									var query = "SELECT * FROM "+$( this ).html()+" LIMIT 100;"
									$("#query").val( query );
									$( "#run" ).trigger( "click" );
								});
						
							});

						},
						
						mouseOver: function( element, colorIn, colorOut ) {
							
							console.log("mouseOver :: element = "+element+" colorIn = "+colorIn+", colorOut = "+colorOut );
							
							$( element ).hover( function() {
								$( this ).css( "background-color", colorIn ); 
								$( this ).css( "color", "white" ); 
							});
					
							$( element ).mouseout( function() {
								$( this ).css( "background-color", colorOut ); 
								$( this ).css( "color", "black"  ); 
							});
						}
				});


// A really lightweight plugin wrapper around the constructor,
// preventing against multiple instantiations
$.fn[ pluginName ] = function ( options ) { console.log("plugin = "+pluginName);
		this.each(function() {
				if ( !$.data( this, 'plugin_' + pluginName ) ) {
						$.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
				}
		});

		// chain jQuery functions
		return this;
};


})( jQuery, window, document );
