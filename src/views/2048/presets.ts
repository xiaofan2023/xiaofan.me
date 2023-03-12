import { levelToScore } from './model'

interface PresetsOptions {
  getTileText: (level: number) => string | number
  getFontSize: (level: number) => string
}

const ArmyFlag = [
  '工兵',
  '班长',
  '排长',
  '连长',
  '营长',
  '团长',
  '师长',
  '旅长',
  '军长',
  '司令',
  '军旗',
]

const Dynasty = [
  '夏',
  '商',
  '周',
  '汉',
  '秦',
  '隋',
  '唐',
  '宋',
  '元',
  '明',
  '清',
]

export const presetList: PresetsOptions[] = [
  {
    getFontSize: (level: number) => (level < 10 ? 'text-4xl' : 'text-3xl'),
    getTileText: levelToScore,
  },
  {
    getFontSize: () => 'text-3xl',
    getTileText: getLabelByPresets(ArmyFlag),
  },
  {
    getFontSize: () => 'text-4xl',
    getTileText: getLabelByPresets(Dynasty),
  },
]

function getLabelByPresets(label: readonly string[]) {
  return (level: number) => {
    if (level < label.length) {
      return label[level - 1]
    }
    return label[label.length - 1]
  }
}
