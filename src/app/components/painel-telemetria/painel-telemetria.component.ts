import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { io } from 'socket.io-client';
import * as L from 'leaflet';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
@Component({
  selector: 'app-painel-telemetria',
  templateUrl: './painel-telemetria.component.html',
  styleUrls: ['./painel-telemetria.component.css'],
})
export class PainelTelemetriaComponent {
  firebaseConfig = {
    apiKey: 'AIzaSyCjR_3jFx5V2YFxF9H95C--X7D0r7jsw68',
    authDomain: 'telemetriasolares-trainee.firebaseapp.com',
    projectId: 'telemetriasolares-trainee',
    storageBucket: 'telemetriasolares-trainee.appspot.com',
    messagingSenderId: '584561323819',
    appId: '1:584561323819:web:5af4ed20cb6a265f009f6e',
  };

  @ViewChild('graficoCorrenteMotor')
  graficoCorrenteMotor: ElementRef<HTMLCanvasElement>;
  canvas: any;
  ctx: any;
  ct: any;

  @ViewChild('graficoVelocidadeBarco')
  graficoVelocidadeBarco: ElementRef<HTMLCanvasElement>;
  canvasVelocidadeBarco: any;
  ctxVelocidadeBarco: any;
  ctVelocidadeBarco: any;

  @ViewChild('graficoCorrenteBateria')
  graficoCorrenteBateria: ElementRef<HTMLCanvasElement>;
  canvasCorrenteBateria: any;
  ctxCorrenteBateria: any;
  ctCorrenteBateria: any;

  title = 'telemetria-solares';
  data: any;
  socket = io('https://telemetria-trainee-2023.onrender.com');
  countCorrenteAbaixoNormal: number = 0;
  config: any = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Corrente no motor',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  configVelocidadeBarco: any = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Velocidade do Barco',
          data: [],
          fill: false,
          borderColor: 'rgb(35,35,142)',
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  configCorrenteBateria: any = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Corrente nas Baterias',
          data: [],
          fill: false,
          borderColor: 'rgb(255,105,97)',
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  private map: L.Map;
  private marker: L.Marker;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.map = L.map('map').setView([-20.3, -40.3], 10); // Set the initial map view
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.canvas = this.graficoCorrenteMotor.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.ct = new Chart(this.ctx, this.config);

    this.canvasVelocidadeBarco = this.graficoVelocidadeBarco.nativeElement;
    this.ctxVelocidadeBarco = this.canvasVelocidadeBarco.getContext('2d');
    this.ctVelocidadeBarco = new Chart(
      this.ctxVelocidadeBarco,
      this.configVelocidadeBarco
    );

    this.canvasCorrenteBateria = this.graficoCorrenteBateria.nativeElement;
    this.ctxCorrenteBateria = this.canvasCorrenteBateria.getContext('2d');
    this.ctCorrenteBateria = new Chart(
      this.ctxCorrenteBateria,
      this.configCorrenteBateria
    );

    this.socket.on('info', (data: any) => {
      this.data = data;

      this.atualizarMapa(data);
      this.atualizarGrafico(this.ct, data.correnteMotor, data);
      this.atualizarGrafico(this.ctVelocidadeBarco, data.velocidadeBarco, data);
      this.atualizarGrafico(
        this.ctCorrenteBateria,
        data.correnteBaterias,
        data
      );
    });
  }

  private atualizarGrafico(chart, dado, data: any) {
    if (chart.data.datasets[0].data.length > 15) {
      chart.data.labels.push(data.updateAt);
      chart.data.labels.shift();
      chart.data.datasets[0].data.push(dado);
      chart.data.datasets[0].data.shift();
    } else {
      chart.data.labels.push(data.updateAt);
      chart.data.datasets[0].data.push(dado);
    }

    chart.update('none');
  }

  private atualizarMapa(data: any) {
    if (this.marker) {
      this.marker.setLatLng([data.latitude, data.longitude]);
      this.map.setView([data.latitude, data.longitude], 15);
    } else {
      this.marker = L.marker([data.latitude, data.longitude]).addTo(this.map);
    }
  }

  sair() {
    this.firebaseService.signOut();
  }
}
