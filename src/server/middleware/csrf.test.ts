import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { verifyOrigin } from './csrf';

function mockReq(method: string, host: string, origin?: string): Request {
  return {
    method,
    get: (header: string) => {
      if (header.toLowerCase() === 'host') return host;
      if (header.toLowerCase() === 'origin') return origin;
      return undefined;
    },
  } as unknown as Request;
}

function mockRes(): Response {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe('verifyOrigin', () => {
  it('allows safe methods regardless of origin', () => {
    const req = mockReq('GET', 'app.example.com', 'https://evil.example.com');
    const res = mockRes();
    const next = vi.fn();

    verifyOrigin(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('allows a same-origin POST', () => {
    const req = mockReq('POST', 'app.example.com', 'https://app.example.com');
    const res = mockRes();
    const next = vi.fn();

    verifyOrigin(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('allows a POST with no Origin header', () => {
    const req = mockReq('POST', 'app.example.com');
    const res = mockRes();
    const next = vi.fn();

    verifyOrigin(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('rejects a cross-origin POST', () => {
    const req = mockReq('POST', 'app.example.com', 'https://evil.example.com');
    const res = mockRes();
    const next = vi.fn();

    verifyOrigin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
