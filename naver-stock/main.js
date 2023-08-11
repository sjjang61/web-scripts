function getThreshold( rate_threshold ){
     var stock_list = [];
     var item_list = $$("div.bx table tbody tr");

     for( var k = 0 ; k < item_list.length ; k++ ){
        var no_items = item_list[k].querySelector( "td span.ico_info");        
        if ( no_items ){
            //console.log( "그룹내에 종목이 없음!!");
            continue;
        }        

        var name = item_list[k].querySelector( "th[scope=row] a").textContent;
        var price = item_list[k].querySelector( "td span").textContent;
        var price_delta = item_list[k].querySelector( "td.ico span.point_status").textContent;
        var percent_str = item_list[k].querySelector( "td:not(.ico) span.point_status").textContent;
        //console.log( name, percent_str, price );
                
         var percent_len = percent_str.length;      
         var percent = Number(percent_str.substring( 0, percent_len - 1 ));         
         var stock = { 'name' : name, 'percent' : percent, 'price' : price, 'price_delta' : price_delta };

         if ( rate_threshold > 0 && percent >= rate_threshold ){
             //console.log( name, '\t', percent );
             stock_list.push( stock );
         }
         else if ( rate_threshold < 0 && percent <= rate_threshold ){
             //console.log( name, '\t', percent );
             stock_list.push( stock );
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
         console.log( stock_list[i].name, '\t', stock_list[i].percent, '\t', stock_list[i].price, '\t', stock_list[i].price_delta );
     }
}
