import * as Parser from './parser';

export interface KontoNode extends ISieNode {
  etikett: PostType.Konto;
  kontonr:  string;//klist[0].kontonr;
  kontonamn: string; //klist[0].kontonamn;
  kontoplan: string; //(kptlist.length > 0 ? kptlist[0].typ : null);
  kontotyp: string; //(ktlist.length > 0 ? ktlist[0].kontotyp : null);
  'SRU-kod': string; //od': (slist.length > 0 ? slist[0]['SRU-kod'] : null);
  enhet: string; //(elist.length > 0 ? elist[0].enhet : null);
}

export interface DimNode<T = PostType.Dim> {
  etikett: T;
  namn: string;
  dimensionsnr: string;
}

export interface UnderdimNode extends DimNode<PostType.Underdim> {
  superdimension: string;
}

export const enum PostType { Objekt = 'objekt', Konto = 'konto', Dim = 'dim', Underdim = 'underdim' }

export type SieNode = SieChildNode & ( DimNode | UnderdimNode | KontoNode ) & { [P in string]: any }

export interface ISieNode {
  poster?: SieNode[];
}

export interface SieChildNode extends ISieNode {
  etikett: PostType;
}

export class SieFile implements ISieNode {
  poster: SieNode[] = [];

  getKonto(kontonr: string): KontoNode | null {
    const klist = this.list('konto', {kontonr});
    if (klist.length < 1) return null;

    const kptlist = this.list('kptyp', {});
    const ktlist = this.list('ktyp', {kontonr});
    const slist = this.list('sru', {konto: kontonr});
    const elist = this.list('enhet', {kontonr});
    return {
      etikett: PostType.Konto,
      kontonr: klist[0].kontonr,
      kontonamn: klist[0].kontonamn,
      kontoplan: (kptlist.length > 0 ? kptlist[0].typ : null),
      kontotyp: (ktlist.length > 0 ? ktlist[0].kontotyp : null),
      'SRU-kod': (slist.length > 0 ? slist[0]['SRU-kod'] : null),
      enhet: (elist.length > 0 ? elist[0].enhet : null),
    };
  }

  getDimension(dimensionsnr: string) {
    const scan = this.poster.concat(Parser.Universal);
    let list = Parser.list(scan, 'underdim', {dimensionsnr});
    if (list.length == 0) {
      list = Parser.list(scan, 'dim', {dimensionsnr});
    }
    if (list.length > 0) {
      return list[0];
    }
  }

  getObjekt(dimensionsnr: string, objektnr: string, separator: string) {
    var separator = separator || ' ';
    const olist = this.list('objekt', {dimensionsnr, objektnr});
    if (olist.length > 0) {
      const d = this.getDimension(dimensionsnr);
      let name = olist[0].objektnamn;
      if (d && d.superdimension) {
        const polist = this.list('objekt', {dimensionsnr: d.superdimension});
        for (const i in polist) {
          if (olist[0].objektnr.indexOf(polist[i].objektnr) == 0) {
            name = this.getObjekt(polist[i].dimensionsnr, polist[i].objektnr, separator).namn + separator + name;
            break;
          }
        }
      }
      return {
        etikett: 'objekt',
        dimensionsnr: olist[0].dimensionsnr,
        objektnr: olist[0].objektnr,
        objektnamn: olist[0].objektnamn,
        namn: name,
      };
    }
  }

  list(etikett: string, nameValues: Record<string, any> /* attribute name value pairs */) {
    return Parser.list(this.poster, etikett, nameValues);
  }
}
