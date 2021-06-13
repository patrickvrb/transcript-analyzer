import { JsonProperty } from 'json-object-mapper';

export default class Script {
  @JsonProperty()
  public channel: number;
  @JsonProperty({ name: 'matching_line' })
  public matching_line: string;
  @JsonProperty({ name: 'matching_sentence' })
  public matching_sentence: string;
  @JsonProperty()
  public order: number;
  @JsonProperty()
  public sentence: string;
  @JsonProperty()
  public similarity: number;
  @JsonProperty()
  public timeFrom: number | null | undefined;
  @JsonProperty()
  public timeTo: number | null;
  public covered: boolean;

  constructor() {
    this.channel = 0;
    this.matching_line = '';
    this.matching_sentence = '';
    this.order = 0;
    this.sentence = '';
    this.similarity = 0;
    this.timeFrom = null;
    this.timeTo = null;
    this.covered = false;
  }
}
