import type { Lists } from ".keystone/types";
import { User } from "./User";
import { Client } from "./Client";
import { Contract } from "./Contract";
import { Invoice } from "./Invoice";
import { Quote } from "./Quote";
import { Service } from "./Service";
import { ServiceType } from "./ServiceType";
import { BusinessNumberType } from "./BusinessNumberType";

export const lists: Lists = {
  User,
  Client,
  Quote,
  Contract,
  Invoice,
  Service,
  ServiceType,
  BusinessNumberType,
};
