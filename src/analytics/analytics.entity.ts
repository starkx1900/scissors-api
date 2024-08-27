import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
})
export class Analytics extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Url', required: true })
  urlId: string;

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: String, required: true })
  userAgent: string;

  @Prop({ type: String })
  location: string;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
