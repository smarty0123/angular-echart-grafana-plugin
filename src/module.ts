import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import defaultsDeep from 'lodash/defaultsDeep';
import { DataFrame } from '@grafana/data';

import * as echarts from 'echarts';

import { EChartOption } from 'echarts';

interface KeyValue {
  key: string;
  value: any;
}

export default class SimpleCtrl extends MetricsPanelCtrl {
  static templateUrl = 'partials/module.html';
  

  panelDefaults = {
    text: 'You can edit!!'
  };

  // Simple example showing the last value of all data
  firstValues: KeyValue[] = [];


  /** @ngInject */
  constructor($scope, $injector) {
    super($scope, $injector);
    defaultsDeep(this.panel, this.panelDefaults);


    // Get results directly as DataFrames
    (this as any).dataFormat = 'series';
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-snapshot-load', this.onSnapshotLoad.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));

  }

  onInitEditMode() {
    this.addEditorTab('Options', `public/plugins/${this.pluginId}/partials/options.html`, 2);
  }

  onDataReceived(data: any) {
    this.render()
  }

  onSnapshotLoad() {
    console.log('On snapshot load ');
  }

  onRender() {
    let myChart = echarts.init(<HTMLDivElement>document.getElementById('main'));
    const options: EChartOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [20, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
        },
      ],
      color: ['#00ff00'],
      tooltip:{
        show: true
      }
    };
    myChart.setOption(options);
    myChart.resize()
    // Tells the screen capture system that you finished
    this.renderingCompleted();
  }

  onDataError(err: any) {
    console.log('onDataError', err);
  }

  // 6.3+ get typed DataFrame directly
  handleDataFrame(data: DataFrame[]) {
    console.log('Handle Data Frame')
    const values: KeyValue[] = [];

    for (const frame of data) {
      for (let i = 0; i < frame.fields.length; i++) {
        values.push({
          key: frame.fields[i].name,
          value: frame.fields[i].values,
        });
      }
    }

    this.firstValues = values;
  }
}

export { SimpleCtrl as PanelCtrl };
