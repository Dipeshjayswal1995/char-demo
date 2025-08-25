import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';
import * as js2xmlparser from 'js2xmlparser';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';


@Injectable({
  providedIn: 'root'
})
export class JsonXml {

  // jsonToXml(jsonObj: any, rootName: string = 'root'): string {
  //   return js2xmlparser.parse(rootName, jsonObj);
  // }

  // // XML to JSON
  // xmlToJson(xmlString: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     xml2js.parseString(xmlString, { explicitArray: false }, (err:any, result: any) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(result);
  //       }
  //     });
  //   });
  // }

  jsonToXml(jsonObj: any): string {
    const builder = new XMLBuilder();
    return builder.build(jsonObj);
  }

  // XML to JSON
  xmlToJson(xmlString: string): any {
    const parser = new XMLParser();
    return parser.parse(xmlString);
  }



}
