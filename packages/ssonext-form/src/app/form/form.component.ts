import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'sn-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class FormComponent implements OnInit {
  activeTabIndex = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
