function getThreshold( rate_threshold ){
     var stock_list = [];
     var item_list = $$("div.bx table tbody tr");
     for( var k = 0 ; k < item_list.length ; k++ ){
        var name = item_list[k].querySelector( "th[scope=row] a").textContent;
        var percent_str = item_list[k].querySelector( "td:not(.ico) span.point_status").textContent;
                
         var percent_len = percent_str.length;      
         var percent = Number(percent_str.substring( 0, percent_len - 1 ));         
         
         if ( rate_threshold > 0 && percent >= rate_threshold ){
             //console.log( name, '\t', percent );
             stock_list.push( { 'name' : name, 'percent' : percent  });
         }
         else if ( rate_threshold < 0 && percent <= rate_threshold ){
             //console.log( name, '\t', percent );
             stock_list.push( { 'name' : name, 'percent' : percent  });
         }        
     }
     // 내림차순 정렬
     if ( rate_threshold >= 0 ){
         stock_list.sort( function( a, b ){
            if(a.percent < b.percent ) return 1;
            return -1;      
         });
     }
     // 오름차순 정렬
     else if ( rate_threshold < 0 ){
         stock_list.sort( function( a, b ){
            if(a.percent >= b.percent ) return 1;
            return -1;      
         });
     }
     
     for ( var i = 0 ; i < stock_list.length ; i++ ){
         console.log( stock_list[i].name, '\t', stock_list[i].percent );
     }
}     