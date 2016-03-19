coldWeb.controller('report', function ($scope, $location,$stateParams,$timeout) {
	$scope.time = $stateParams.time;
	$scope.item = $stateParams.item;
	$scope.drawline = function(){
        var data = {
          data: [[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],[11,11],[12,12],[13,13],[14,14],[15,15]],
          color: "#00c0ef"
        };
        $.plot("#line-chart", [data], {
          grid: {
            hoverable: true,
            borderColor: "#f3f3f3",
            borderWidth: 1,
            tickColor: "#f3f3f3"
          },
          series: {
            shadowSize: 0,
            lines: {
              show: true
            },
            points: {
              show: true
            },
            label: "耗能",
            bars: {
                show: true,
                barWidth: 0.5,
                align: "center"
              }
          },
          lines: {
            fill: false,
            color: ["#3c8dbc"]
          },
          yaxis: {
            show: true,
          },
          xaxis: {
            show: true,
            mode: "categories",
          }
        });
        //Initialize tooltip on hover
        $('<div class="tooltip-inner" id="line-chart-tooltip"></div>').css({
          position: "absolute",
          display: "none",
          opacity: 0.8
        }).appendTo("body");
        $("#line-chart").bind("plothover", function (event, pos, item) {

          if (item) {
            var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

            $("#line-chart-tooltip").html(item.series.label + ":" + y)
                    .css({top: item.pageY + 5, left: item.pageX + 5})
                    .fadeIn(200);
          } else {
            $("#line-chart-tooltip").hide();
          }
        });
	};
	$scope.drawbount = function(){
		var donutData = [
         {label: "发电机", data: 30, color: "#3c8dbc"},
         {label: "风扇", data: 20, color: "#0073b7"},
         {label: "冷箱", data: 50, color: "#00c0ef"}
       ];
		function labelFormatter(label, series) {
	        return '<div style="font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;">'
	                + label
	                + "<br>"
	                + Math.round(series.percent) + "%</div>";
	      };
       $.plot("#donut-chart", donutData, {
         series: {
           pie: {
             show: true,
             radius: 1,
             innerRadius: 0.5,
             label: {
               show: true,
               radius: 2 / 3,
               formatter: labelFormatter,
               threshold: 0.1
             }

           }
         },
         legend: {
           show: false
         }
       });
	}
	$scope.drawline();
	if($scope.item == 'total'){
		$timeout(function() {
           $scope.drawbount();
         }, 0)
      }
});