import { shallowMount } from "@vue/test-utils";
import GetLocation from "./GetLocation.vue";

describe('GetLocation', () => {
  let originalGeolocation: Geolocation;
  const geolocationMock = {
    getCurrentPosition: vi.fn(),
  };

  beforeAll(() => {
    originalGeolocation = navigator.geolocation;
    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: geolocationMock,
    });
  });

  afterAll(() => {
    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: originalGeolocation,
    });
  });

  it('should render the component without crashing', () => {
    const wrapper = shallowMount(GetLocation);
    expect(wrapper).toBeTruthy();
  });

  it('displays when geolocation resolved successfully', (): void => {
    const mockGeolocation = vi.fn((successCallback: Function) => {
      const position = {
        coords: {
          latitude: 51.5074,
          longitude: -0.1278,
        },
      };
      successCallback(position);
    });

    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: {
        getCurrentPosition: mockGeolocation,
      },
    });

    const wrapper = shallowMount(GetLocation);
    expect((wrapper.vm as any).coords).toEqual({
      latitude: 51.5074,
      longitude: -0.1278,
    });
  });

  it('displays a message when user denied access', async (): Promise<void> => {
    const mockGeolocation = vi.fn((successCallback, errorCallback) => {
      const error = new Error("User denied geolocation access");
      errorCallback(error);
    });

    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: {
        getCurrentPosition: mockGeolocation,
      },
    });

    const wrapper = shallowMount(GetLocation);

    // Waiting for the component to update after the asynchronous action
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).geolocationBlockedByUser).toEqual(true);
    expect(wrapper.html()).toContain('User denied access');
  });
});
