

    /*
     * Code to make and validate the settings ranges.
     * Date : 19-03-2019
     * Developer : Sat Singh Rana
     */
    var $system = {};

    var settings = {

        init : function() {

            $system.settingsBlock       = $('#advance-pricing-body');
            $system.rangeOverlapError   = false;
            $system.minMaxValidateError = false;
            $system.input               = $('.range');
            $system.row                 = $('.adPriceRow');
            $system.rangeRows           = $('#advance-pricing-body .adPriceRow').not('.restPriceRange');
            $system.totalRows           = $('#advance-pricing-body .adPriceRow').not('.restPriceRange').length;
            $system.wouldBeRangeIndex   = $system.totalRows - 1;
            
            $system.initiatorStart      = '.range_start_field';
            $system.initiatorEnd        = '.range_end_field';
            
            $system.errors              = [];
            


            console.log($system.initiatorStart);
            console.log($system.initiatorEnd);

            settings.min_max_validate();

            


        },
        min_max_validate : function() {

            $system.minMaxValidateError = false;

            var rowIndex  = 0;

            for(rowIndex = 0; rowIndex < $system.totalRows; rowIndex++) {

                

                var rangeStart = $system.row.eq( rowIndex ).find('.range_start_field').val();
                var rangeEnd   = $system.row.eq( rowIndex ).find('.range_end_field').val();

                    rangeStart = ( rangeStart ) ? parseFloat( rangeStart ) : undefined;
                    rangeEnd   = ( rangeEnd )   ? parseFloat( rangeEnd )   : undefined;
                    
                console.log('Row : ',rowIndex,' range start =',rangeStart,' range end', rangeEnd);

                if (rowIndex == $system.wouldBeRangeIndex) {

                    if (rangeEnd != undefined) {

                        if (rangeEnd <= rangeStart) {

                            $system.minMaxValidateError = true;

                        }else {
                            
                            // $system.minMaxValidateError = false;
                            

                        }
                    }

                }else {

                    if (rangeStart == undefined || rangeStart == undefined) {

                        $system.minMaxValidateError = false;

                    }else {

                        if (rangeEnd <= rangeStart) {
                            
                            $system.minMaxValidateError = true;

                            // $system.minMaxValidateError = "Cost range end must be greater then cost range start.";

                        }
                    }
                }
            }

            settings.range_overlap_check();   


        },
        range_overlap_check : function() {

            $system.rangeOverlapError = false;

            var rowIndex  = 0;


            for(rowIndex = 0; rowIndex < $system.totalRows; rowIndex++) {

                console.log( $system.row.eq( rowIndex ) );

                var currentRowRangeEnd = $system.row.eq( rowIndex ).find('.range_end_field').val();
                var nextRangeStart     = $system.row.eq( rowIndex+1 ).find('.range_start_field').val();

                    currentRowRangeEnd = ( currentRowRangeEnd ) ? parseFloat( currentRowRangeEnd ) : undefined;
                    nextRangeStart   = ( nextRangeStart )   ? parseFloat( nextRangeStart )   : undefined;
                    
                console.log('Row : ',rowIndex,' range end =',currentRowRangeEnd,' range start', nextRangeStart);


                
                



                
                if (rowIndex == $system.wouldBeRangeIndex) {
                    /*
                    if (currentRowRangeEnd != undefined) {

                        if (currentRowRangeEnd <= rangeStart) {

                            $system.minMaxValidateError = "Cost range end must be greater then cost range start.";

                        }else {
                            
                            $system.minMaxValidateError = null;
                            showError = false;

                        }
                    }
                    */

                }else {

                    if (currentRowRangeEnd == undefined || nextRangeStart == undefined) {

                        $system.rangeOverlapError = false;

                    }else {

                        if (nextRangeStart <= currentRowRangeEnd) {
                            
                            $system.rangeOverlapError = true;

                        }
                    }
                }
                
                
            }





            // call the error_handler.

            settings.error_handler($system.minMaxValidateError, $system.rangeOverlapError);

        },
        check_if_we_can_create_new_row : function() {
            console.log( 'Check if we can create a new row.' );
            
            if ($($system.realtimeInputHolder).closest('.adPriceRow').hasClass('createNewRange') && 
                $($system.realtimeInputHolder).val() && 
                $($system.realtimeInputHolder).hasClass('range_end_field')) {
                
                console.log('Yes we can create a new row');
                settings.create_new_row();

            }else {
                console.log('No we can not create a new row its not the last row');

                console.log('Errors are : ', $system.errors);
                

            }





            console.log('Completed :-)');



        },
        create_new_row : function() {


            $('.adPriceRow').removeClass('createNewRange');


            newRowHTML = '';
            rangeIndex = 'new';

            newRangeStartFrom = parseFloat( $("#advance-pricing-body tr:last-child").prev().find(".range_end_field").val() )+0.01;

            newRowHTML+='<tr class="adPriceRow createNewRange">';
                newRowHTML+='<td>';
                    newRowHTML+='<div class="col-md-5" style="padding: 0;">';
                        newRowHTML+='<div class="input-group">';
                            newRowHTML+='<span class="input-group-addon">$</span>';
                            newRowHTML+='<input onkeypress="onlyDigitsAreAllowed();" type="text" name="cost[{{statI}}][from]" class="form-control floatCheck range_'+rangeIndex+'_start_from range_start_field" value="'+newRangeStartFrom+'">';
                        newRowHTML+='</div>';
                    newRowHTML+='</div>';
                    newRowHTML+='<div class="col-md-1 widthhash" style=""></div>';
                    newRowHTML+='<div class="col-md-5 settingSecondCost" style="padding: 0;">';
                        newRowHTML+='<div class="input-group">';
                            newRowHTML+='<span class="input-group-addon">$</span>';
                            newRowHTML+='<input onkeypress="onlyDigitsAreAllowed();" type="text" name="cost[{{statI}}][to]" class="form-control floatCheck range_'+rangeIndex+'_end range_end_field" value="">';
                        newRowHTML+='</div>';
                    newRowHTML+='</div>';
                newRowHTML+='</td>';
                newRowHTML+='<td>';
                newRowHTML+='<div class="col-md-7" style="padding: 0 4px 0 0;">';
                    newRowHTML+='<select disabled onchange="changeOprator.call(this);" class="timeZoneSelect for-advanced-price-1 range_'+rangeIndex+'_price_change_type price_change_type" name="cost[{{statI}}][priceChangeType]">';
                        newRowHTML+='<option value="1">Multiplied by</option>';
                        newRowHTML+='<option value="2">Markup by</option>';
                    newRowHTML+='</select>';
                newRowHTML+='</div>';
                newRowHTML+='<div class="col-md-5 input-group" style="padding-right:0px;">';
                    newRowHTML+='<span class="input-group-addon advance-opr-1">x</span>';
                    newRowHTML+='<input disabled type="text" onkeypress="onlyDigitsAreAllowed();" class="form-control floatCheck range_'+rangeIndex+'_price_change_amount price_change_value" name="cost[{{statI}}][priceChange]">';
                newRowHTML+='</div>';
                newRowHTML+='</td>';
                newRowHTML+='<td>';
                    newRowHTML+='<div class="col-md-7" style="padding: 0 4px 0 0;">';
                        newRowHTML+='<select disabled onchange="changeOprator.call(this);" class="timeZoneSelect for-advanced-price-2 range_'+rangeIndex+'_comp_price_change_type comp_price_change_type" name="cost[{{statI}}][compPriceChangeType]">';
                            newRowHTML+='<option value="1">Multiplied by</option>';
                            newRowHTML+='<option value="2">Markup by</option>';
                        newRowHTML+='</select>';
                    newRowHTML+='</div>';
                    newRowHTML+='<div class="col-md-5 input-group" style="padding-right: 0px;">';
                        newRowHTML+='<span class="input-group-addon advance-opr-2">x</span>';
                        newRowHTML+='<input disabled type="text" onkeypress="onlyDigitsAreAllowed();" class="form-control floatCheck range_'+rangeIndex+'_comp_price_change_amount comp_price_change_value" name="cost[{{statI}}][compPriceChange]">';
                    newRowHTML+='</div>';
                newRowHTML+='</td>';
                newRowHTML+='<td class="delete-current-row"></td>';
            newRowHTML+='</tr>';

            $system.settingsBlock.find('tr:last').prev().find('.delete-current-row').html('<i class="icon-cross2 removePriceAdvanceSetRow"></i>');

            $system.settingsBlock.find('tr:last').prev().after(newRowHTML);

            // RECREATE SELECT2... ON NEWLY APPENDED ROW...
            $('.timeZoneSelect').select2({ minimumResultsForSearch: Infinity, });


            // Make the fields available 

            $("#advance-pricing-body input[type=text]").prop("disabled", false);
            $("#advance-pricing-body select").prop("disabled", false);

        },
        error_handler : function( minMaxError, rangeOverlapError ) {

            $(".pricing-errors").hide(); 
            $(".pricing-errors").html(''); 

            if (minMaxError) {

                console.log( 'Cost range end must me greater then cost start value.' );
                $system.errors[0] = 'Cost range end must me greater then cost start value.'; 

               

            }

            if(rangeOverlapError) {

                console.log( 'Your ranges overlap.' );
                if ($system.errors.length>0) {

                    $system.errors[1] = 'Your ranges overlap.'; 
                }else {
                    
                    $system.errors[0] = 'Your ranges overlap.'; 

                }
                

            }

            if ($system.errors.length != 0) {

                console.log( $system.errors );

                var ErrorHtml = '';
                $.each($system.errors, function(i,d){
                    console.log(d)
                    ErrorHtml += d+'<br>';


                });

                $(".pricing-errors").show(); 
                $(".pricing-errors").html(ErrorHtml); 


                return;
            }


            if (!minMaxError & !rangeOverlapError) {

                console.log('Error handler : No error to show');

            }

            // Check if we can create new row for the range.
            settings.check_if_we_can_create_new_row();

        }
    };

    



    $(document).on('input', $('#advance-pricing-body').find('.range_start_field'), function(ev) {

        console.log("input happened in range start");
        $system.realtimeInputHolder = ev.target;
        settings.init();
        $system.realtimeInputHolder = null;

    });
            
           
    $(document).on('input', $('#advance-pricing-body').find('.range_start_field') , function(ev) {

        console.log("input happened in range end");
        $system.realtimeInputHolder = ev.target;
        settings.init(); 
        $system.realtimeInputHolder = null;

    });

   
