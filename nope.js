var background = chrome.extension.getBackgroundPage();

google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawChart);
      var testCase = 
      [[1,  37.8, 80.8, 41.8, 38  ],
        [2,  30.9, 69.5, 32.4,  8 ],
        [3,  25.4,   57, 25.7,  31],
        [4,  11.7, 18.8, 10.5,  22],
        [5,  11.9, 17.6, 10.4,  27],
        [6,   8.8, 13.6,  7.7,  15],
        [7,   7.6, 12.3,  9.6,  13],
        [8,  12.3, 29.2, 10.6,  6 ],
        [9,  16.9, 42.9, 14.8,  48],
        [10, 12.8, 30.9, 11.6,  34],
        [11,  5.3,  7.9,  4.7,  28],
        [12,  6.6,  8.4,  5.2,  33],
        [13,  4.8,  6.3,  3.6,  8 ],
        [14,  4.2,  6.2,  3.4,  7 ],
        [15,  11.9, 17.6, 10.4,  27],
        [16,   8.8, 13.6,  7.7,  15],
        [17,   7.6, 12.3,  9.6,  13],
        [18,  12.3, 29.2, 10.6,  6 ],
        [19,  16.9, 42.9, 14.8,  48],
        [20, 12.8, 30.9, 11.6,  34],
        [21,  5.3,  7.9,  4.7,  28],
        [22,  6.6,  8.4,  5.2,  33],
        [23,  4.8,  6.3,  3.6,  8 ],
        [24,  4.2,  6.2,  3.4,  7 ]
      ];

    function drawChart() {
      var data = new google.visualization.DataTable();
      var tableData = background.getGraphData();
      console.log(tableData);
      data.addColumn('number','hour');
      data.addColumn('number', 'facebook','#fff');
      data.addColumn('number', 'twitter','#666');
      data.addColumn('number', 'youtube');
      data.addColumn('number', 'instagram');
      data.addRows(tableData);

      var options = {
        animation: {
          startup: 'true',   /* Need to add this for animations */
          duration: 1000,
          easing: 'out',
        },
        colors:["#3b5998","#00aced","#ff0000","#fb3958"],
        chart: {
          title: '',
          subtitle: ''
        },
        curveType: 'function',
        legend: {
          position: 'none'
        },
        width: 450,
        height: 150,
        hAxis: {
          title:'',
          ticks:[]
        },
        vAxis: {
          title:'',
          ticks:[],
          gridlines: {
            color: 'transparent'
          }
        },
        axes: {
          x: {
            0: {side: 'bottom',label:''}
          }
        }
      };

      var chart = new google.charts.Line(document.getElementById('curve_chart'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }


    