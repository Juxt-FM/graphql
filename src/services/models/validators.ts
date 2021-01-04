/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validatePhone = (phoneNumber: string) => {
  const re = /^\+[1-9]\d{10,14}$/;
  return re.test(phoneNumber);
};
