import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import fetchMock from "fetch-mock";

afterEach(fetchMock.resetHistory);
