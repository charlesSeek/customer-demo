import { customerReducer, initialState } from "../hooks/useCustomers";

describe("customerReducer", () => {
  it("should handle SET_CUSTOMERS action", () => {
    const customers = [
      {
        "id": "723d21ef-f5ad-4ac3-b04a-9fbc54c4d22b",
        "fullName": "Erhart Andrioni",
        "email": "eandrioni0@adobe.com",
        "registrationDate": "2024-07-31T04:25:55Z"
      },
      {
        "id": "7558e414-0262-4c28-8cb7-81dc9b147e6a",
        "fullName": "Vanna Schole",
        "email": "vschole1@comcast.net",
        "registrationDate": "2024-06-23T16:02:22Z"
      },
    ];
    const result = customerReducer(initialState, {
      type: 'SET_CUSTOMERS',
      payload: {
        items: customers,
        total: 2,
        totalPage: 1
      }
    })
    expect(result.customers).toEqual(customers);
    expect(result.total).toBe(2);
    expect(result.totalPage).toBe(1);
  });

  it("should handle SET_SEARCH action", () => {
    const result = customerReducer(initialState, {
      type: 'SET_SEARCH',
      payload: 'test'
    });

    expect(result.search).toEqual("test");
  });

  it("should handle SET_START_DATE action", () => {
    const result = customerReducer(initialState, {
      type: 'SET_START_DATE',
      payload: '2024-01-01'
    });
    expect(result.startDate).toEqual("2024-01-01");
  });

  it("should handle SET__END_DATE action", () => {
    const result = customerReducer(initialState, {
      type: 'SET_END_DATE',
      payload: '2024-12-09'
    });
    expect(result.endDate).toEqual("2024-12-09");
  });

  it("should handle SET__PAGE_SIZE action", () => {
    const result = customerReducer(initialState, {
      type: 'SET_PAGE_SIZE',
      payload: 25
    });
    expect(result.pageSize).toEqual(25);
  });

  it("should handle SET__PAGE action", () => {
    const result = customerReducer(initialState, {
      type: 'SET_PAGE',
      payload: 1
    });
    expect(result.page).toEqual(1);
  });

  it("should handle SET__ORDER action", () => {
    const result = customerReducer(initialState, {
      type: 'SET_ORDER',
      payload: 'desc'
    });
    expect(result.order).toEqual('desc');
  });

});
