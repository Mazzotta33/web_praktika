const assert = require('assert');
const Account  = require('../models/Account');

describe('Account — генерация временного пароля', function () {
  it('длина пароля равна 8 символам', function () {
    const pass = Account._generateTempPassword();
    assert.strictEqual(pass.length, 8);
  });

  it('пароль содержит только допустимые символы', function () {
    const allowed = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789]+$/;
    for (let i = 0; i < 20; i++) {
      assert.match(Account._generateTempPassword(), allowed);
    }
  });

  it('два вызова подряд дают разные пароли (вероятностно)', function () {
    const passes = new Set();
    for (let i = 0; i < 10; i++) passes.add(Account._generateTempPassword());
    assert.ok(passes.size > 1, 'Все 10 паролей оказались одинаковыми');
  });
});

describe('Account — хеширование и проверка пароля', function () {
  it('verifyPassword возвращает true для правильного пароля', async function () {
    const bcrypt = require('bcryptjs');
    const plain = 'testPass1';
    const hash  = await bcrypt.hash(plain, 10);
    const result = await Account.verifyPassword(plain, hash);
    assert.strictEqual(result, true);
  });

  it('verifyPassword возвращает false для неверного пароля', async function () {
    const bcrypt = require('bcryptjs');
    const hash  = await bcrypt.hash('correct', 10);
    const result = await Account.verifyPassword('wrong', hash);
    assert.strictEqual(result, false);
  });
});
