export interface KontoNode extends ISieNode {
  etikett: PostType.Konto;
  kontonr:  string;//klist[0].kontonr;
  kontonamn: string; //klist[0].kontonamn;
  kontoplan: string; //(kptlist.length > 0 ? kptlist[0].typ : null);
  kontotyp: string; //(ktlist.length > 0 ? ktlist[0].kontotyp : null);
  'SRU-kod': string; //od': (slist.length > 0 ? slist[0]['SRU-kod'] : null);
  enhet: string; //(elist.length > 0 ? elist[0].enhet : null);
}

export interface ObjektNode extends ISieNode {
  etikett: 'objekt',
  dimensionsnr: string,
  objektnr: string,
  objektnamn: string,
  namn: string,
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


export interface ISieNode {
  poster?: SieNode[];
}

export interface SieChildNode extends ISieNode {
  etikett: PostType;
}

export type SieNode = SieChildNode & ( DimNode | UnderdimNode | KontoNode ) & { [P in string]: any }

export const Universal: SieNode[] = [
  { etikett: PostType.Dim, dimensionsnr: '1', namn: 'Kostnadsställe / resultatenhet' },
  {
    etikett: PostType.Underdim, dimensionsnr: '2', namn: 'Kostnadsbärare', superdimension: '1',
  },
  { etikett: PostType.Dim, dimensionsnr: '6', namn: 'Projekt' },
  { etikett: PostType.Dim, dimensionsnr: '7', namn: 'Anställd' },
  { etikett: PostType.Dim, dimensionsnr: '8', namn: 'Kund' },
  { etikett: PostType.Dim, dimensionsnr: '9', namn: 'Leverantör' },
  { etikett: PostType.Dim, dimensionsnr: '10', namn: 'Faktura' },
];
